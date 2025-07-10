import { useState } from 'react';
import Modal from '../modals/Modal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import { capitalCase } from 'change-case';
import Icon from '@mdi/react';
import { mdiArrowULeftBottom, mdiFolderOutline } from '@mdi/js';
import Divider from '../Divider';
import ArrowHeader3 from '../ArrowHeader3';

const TileListModal = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const { folders, currentFolder, setCurrentFolder, path, setPath } =
    useOutletContext() || {};

  return (
    <Modal className="relative h-full">
      <h1>Tile Explorer</h1>
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
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
        {path.slice(1).map((part) => (
          <ArrowHeader3 title={capitalCase(part)} />
        ))}
      </div>
      <Divider className="!my-0" />
      <div className="scrollbar-primary mb-auto grid w-full grid-cols-1 gap-4 overflow-y-auto rounded pb-2 sm:grid-cols-2">
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
              <div className="col-span-2 grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-4">
                {value.map((file: string, index: number) => {
                  const fullPath = path.join('/');
                  return (
                    <div
                      key={index}
                      className="hover:border-accent relative aspect-square size-full rounded border-2 border-gray-500 shadow-md shadow-black"
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
        className="sticky bottom-0 w-full"
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
