import { useMemo, useState } from 'react';
import Modal from '../modals/Modal';
import InputSelectField from '../InputSelectField';
import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import { useStore } from '@tanstack/react-form';
import { capitalCase } from 'change-case';
import Icon from '@mdi/react';
import { mdiArrowULeftBottom, mdiFolder, mdiFolderOutline } from '@mdi/js';

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

  const { tileForm, folders, currentFolder, setCurrentFolder, path, setPath } =
    useOutletContext() || {};

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
        {/* <tileForm.Field
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
        </tileForm.Field> */}
        <button
          className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
          aria-label="Clear autosaved map"
          type="button"
          onClick={() => {
            if (path.length === 2) return;

            const newPath = path.slice(0, -1).slice(2);
            if (newPath.length === 0) {
              setPath((prev) => prev.slice(0, -1));
              setCurrentFolder(folders);
              return;
            }

            let currentFolder = folders;
            newPath.forEach((part) => {
              currentFolder = currentFolder[part];
            });

            setPath((prev) => prev.slice(0, -1));
            setCurrentFolder(currentFolder);
          }}
        >
          <Icon
            path={mdiArrowULeftBottom}
            className="text-tertiary group-hover:text-accent timing size-8"
          />
        </button>
      </div>
      <div className="scrollbar-primary grid w-full grid-cols-2 gap-4 overflow-y-auto rounded">
        {Object.entries(currentFolder).map(([key, value], index) =>
          key !== 'files' ? (
            <button
              key={index}
              className="bg-tertiary group flex w-full items-center gap-4 rounded p-2 shadow-md shadow-black"
              onClick={() => {
                setCurrentFolder((prev) => prev[key]);
                setPath((prev) => [...prev, key]);
              }}
            >
              <Icon
                path={mdiFolderOutline}
                className="text-secondary group-hover:text-accent timing size-8"
              />
              <h4 className="group-hover:text-accent timing">
                {capitalCase(key)}
              </h4>
            </button>
          ) : (
            value.length > 0 && (
              <div className="col-span-2 grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-4">
                {value.map((file: string, index: number) => {
                  const fullPath = path.join('/');
                  return (
                    <div
                      key={index}
                      className="hover:border-accent relative aspect-square size-full rounded border-2 border-gray-500"
                      style={{
                        backgroundImage: `url(${fullPath}/${file})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        imageRendering: 'pixelated',
                        backgroundRepeat: 'no-repeat',
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {hoveredIndex === index && (
                        <p className="bg-tertiary absolute right-0 top-0 rounded !bg-opacity-90 p-1 text-sm">
                          {file}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ),
        )}
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
