import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@affine/admin/components/ui/accordion';
import { useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const CollapsibleItem = ({
  items,
  title,
  changeModule,
}: {
  title: string;
  items: string[];
  changeModule?: (module: string) => void;
}) => {
  const location = useLocation();
  const activeSubTab = location.hash.slice(1);

  const handleClick = useCallback(
    (id: string) => {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      changeModule?.(title);
    },
    [changeModule, title]
  );
  return (
    <Accordion type="multiple" className="w-full ">
      <AccordionItem value="item-1" className="border-b-0 ml-7 ">
        <NavLink
          to={`/admin/settings/${title}`}
          className={({ isActive }) => {
            return isActive
              ? 'w-full bg-zinc-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
              : '';
          }}
        >
          <AccordionTrigger
            onClick={() => handleClick(title)}
            className="py-2 px-2 rounded [&[data-state=closed]>svg]:rotate-270 [&[data-state=open]>svg]:rotate-360"
          >
            {title}
          </AccordionTrigger>
        </NavLink>
        <AccordionContent className="flex flex-col gap-2 py-1">
          {items.map(item => (
            <NavLink
              key={item}
              to={`/admin/settings/${title}#${item}`}
              className={({ isActive }) => {
                return isActive && activeSubTab === item
                  ? `transition-all overflow-hidden w-full bg-zinc-100 inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`
                  : '';
              }}
            >
              <AccordionContent
                onClick={() => handleClick(item)}
                className={`py-1 px-2 rounded text-ellipsis whitespace-nowrap overflow-hidden`}
              >
                {item}
              </AccordionContent>
            </NavLink>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const OtherModules = ({
  moduleList,
  changeModule,
}: {
  moduleList: {
    moduleName: string;
    keys: string[];
  }[];
  changeModule?: (module: string) => void;
}) => {
  return (
    <Accordion type="multiple" className="w-full ">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="ml-7 py-2 px-2 rounded [&[data-state=closed]>svg]:rotate-270 [&[data-state=open]>svg]:rotate-360">
          Other
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 py-1">
          {moduleList.map(module => (
            <CollapsibleItem
              key={module.moduleName}
              items={module.keys}
              title={module.moduleName}
              changeModule={changeModule}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
