import { useEffect, useRef, useState } from 'react';
import Modal from '../modals/Modal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import { capitalCase } from 'change-case';
import Icon from '@mdi/react';
import { mdiArrowULeftBottom, mdiCancel, mdiFolderOutline } from '@mdi/js';
import Divider from '../Divider';
import ArrowHeader3 from '../ArrowHeader3';
import BtnIcon from '../buttons/BtnIcon';

const TileListModal = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });

  const navigate = useNavigate();

  const pngRef = useRef<HTMLDivElement | null>(null);

  const getCoords = (width: number, index: number) => {
    const row = Math.floor((index - 1) / width + 1);
    const col = index % width === 0 ? width : index % width;

    return { row, col };
  };

  const {
    folders,
    currentFolder,
    setCurrentFolder,
    path,
    setPath,
    isPng,
    pngPath,
    handleTileSelect,
    tempComponent,
    setTempComponent,
  } = useOutletContext() || {};

  useEffect(() => {
    if (!pngPath) return;

    const div = pngRef.current;
    if (!div) return;

    const img = new Image();
    img.src = pngPath;
    img.onload = () => {
      const naturalW = img.width;
      const naturalH = img.height;

      setGrid({
        rows: Math.ceil(naturalH / 48),
        cols: Math.ceil(naturalW / 48),
      });
    };
  }, [pngPath]);

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
        {path.slice(1).map((part: string, index: number) => (
          <ArrowHeader3 key={index} title={capitalCase(part)} />
        ))}
        {tempComponent && (
          <button
            className="bg-tertiary group ml-auto flex rounded p-1.5 shadow-md shadow-black"
            aria-label="Clear temporary component"
            type="button"
            onClick={() => {
              setTempComponent(null);
            }}
          >
            <Icon
              path={mdiCancel}
              className="text-tertiary group-hover:text-accent timing size-8"
            />
          </button>
        )}
      </div>
      <Divider className="!my-0" />
      <div className="scrollbar-primary flex h-full w-full items-start justify-center overflow-y-auto">
        {isPng ? (
          <div
            ref={pngRef}
            className="relative grid justify-center"
            style={{
              height: `${grid.rows * 48}px`,
              width: `${grid.cols * 48}px`,
              backgroundImage: `url(${pngPath})`,
              backgroundSize: 'cover',
              gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
              gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
            }}
          >
            {Array.from({ length: grid.rows * grid.cols }).map((_, index) => {
              const { row, col } = getCoords(grid.cols, index + 1);

              const inCol = tempComponent
                ? col >= tempComponent.imageColStart &&
                  col < tempComponent.width + tempComponent.imageColStart
                : false;

              const inRow = tempComponent
                ? row >= tempComponent.imageRowStart &&
                  row < tempComponent.height + tempComponent.imageRowStart
                : false;

              const selected = inCol && inRow;

              return (
                <div
                  key={index}
                  className={`${selected ? 'bg-yellow-300/50 hover:bg-yellow-300/80' : 'hover:bg-gray-400/50'} size-full ring-1 ring-inset ring-gray-400/50`}
                  style={{ gridRow: row, gridColumn: col }}
                  onClick={() => {
                    handleTileSelect(row, col);
                  }}
                />
              );
            })}
          </div>
        ) : (
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
                  <div className="col-span-2 grid grid-cols-3 gap-4">
                    {value.map((file: string, index: number) => {
                      const fullPath = path.join('/');
                      return (
                        <button
                          key={index}
                          className="hover:border-accent relative aspect-square size-full rounded border-2 border-gray-500 shadow-md shadow-black"
                          style={{
                            backgroundImage: `url(${fullPath}/${file})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            imageRendering: 'pixelated',
                            backgroundRepeat: 'no-repeat',
                          }}
                          onClick={() =>
                            setPath((prev) => [...prev, `${file}`])
                          }
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          {hoveredIndex === index && (
                            <p className="bg-tertiary absolute right-0 top-0 rounded !bg-opacity-90 p-1 text-sm">
                              {file}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )
              ),
            )}
          </div>
        )}
      </div>

      <BtnRect
        className="sticky bottom-0 w-full"
        type="button"
        ariaLabel="Select category"
        onClick={() => navigate(-1)}
      >
        Select
      </BtnRect>
    </Modal>
  );
};

export default TileListModal;
