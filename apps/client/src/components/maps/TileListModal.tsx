import { useMemo, useState } from 'react';
import Modal from '../modals/Modal';
import InputSelectField from '../InputSelectField';
import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import { useStore } from '@tanstack/react-form';

const tileModules = import.meta.glob('/src/assets/tiles/*/*/*.png', {
  eager: true,
});

const categoryFolders = Array.from(
  new Set(
    Object.keys(tileModules)
      .map((path) => {
        const match = path.match(/\/src\/assets\/tiles\/([^/]+)\/([^/]+)\//);
        return match?.[1];
      })
      .filter(Boolean),
  ),
);

const subFolders = Array.from(
  new Set(
    Object.keys(tileModules)
      .map((path) => {
        const match = path.match(/\/src\/assets\/tiles\/([^/]+)\/([^/]+)\//);
        return `${match?.[1]}/${match?.[2]}`;
      })
      .filter(Boolean),
  ),
);

const TileListModal = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const { tileForm } = useOutletContext() || {};

  const category = useStore(tileForm.store, (state) => state.values.category);
  const type = useStore(tileForm.store, (state) => state.values.type);

  const tilePaths = Object.entries(tileModules)
    .filter(([path]) => path.includes(`/tiles/${category}/${type}`))
    .map(([, mod]: any) => mod.default);

  const filteredTypes = useMemo(
    () =>
      subFolders
        .filter((path) => path?.includes(category))
        .map((item) => item.split('/')[1]),
    [category, categoryFolders],
  );

  return (
    <Modal className="relative h-full">
      <h1>Tile Explorer</h1>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-8">
        <tileForm.Field
          name="category"
          listeners={{ onChange: () => tileForm.setFieldValue('type', '') }}
        >
          {(field) => (
            <InputSelectField
              label="Tile Category"
              field={field}
              options={categoryFolders}
            />
          )}
        </tileForm.Field>
        <tileForm.Field name="type">
          {(field) => (
            <InputSelectField
              label="Tile Category"
              field={field}
              options={filteredTypes}
            />
          )}
        </tileForm.Field>
      </div>
      <div className="bg-tertiary scrollbar-primary col-span-3 grid w-full grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-4 overflow-y-auto rounded p-4">
        {tilePaths.map((path, index) => {
          const parts = path.split('/');

          const fileName = parts[parts.length - 1].split('.')[0];

          return (
            <div
              className={`sprite relative aspect-square size-full rounded border-2 border-gray-400 border-opacity-50 hover:border-gray-100 hover:ring-1 hover:ring-inset`}
              style={{ backgroundImage: `url(${path})` }}
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('tileUrl', path)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <p className="bg-tertiary border-accent absolute top-0 -translate-y-2 rounded border-2 !bg-opacity-90 p-1 text-center">
                  {fileName}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <BtnRect
        className="sticky bottom-0 mt-auto w-full"
        type="button"
        ariaLabel="Select category"
        onClick={() => navigate(-1)}
      >
        Select Category
      </BtnRect>
    </Modal>
  );
};

export default TileListModal;
