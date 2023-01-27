import React, {
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  SetStateAction,
} from 'react';
import { motion } from 'framer-motion';
import { General, toolsConstructors } from '../../utils/constants';
import { useRouter } from 'next/router';
import InterfaceIntegration from '../lib/handlers/InterfaceInjectors/ProjectsSourceHandler';
import DatabaseService from '../lib/services/DatabaseService';
import ElementModifier from '../lib/modifiers/ElementModifier';
import JsxParser from 'react-jsx-parser';
import SlobyInput from '../../components/SlobyInput';
import JSXStyle from 'styled-jsx/style';
import Input from './editor-components/text-tool/Input';
import Draggable from 'react-draggable-fixed';
import interfaceIntegrator from '../lib/handlers/InterfaceInjectors';

export default function SlobyPreviewSiteInterface({
  setToolClicked,
  toolClicked,
}: {
  setToolClicked: React.Dispatch<SetStateAction<boolean>>;
  toolClicked: boolean;
}) {
  const [currentSource, setCurrentSource] = useState<any>('');
  const router = useRouter();
  const source = new interfaceIntegrator();

  async function getCurrentSource() {
    return await source.getProjectBasedSourceCode(router.query.id as string);
  }

  async function handleDataFetching() {
    if ((await source.getSingle(router.query.id as string)) === null) {
      return await source.add('', router.query.id as string);
    } else {
      const sourceCode = await getCurrentSource();
      return setCurrentSource(sourceCode);
    }
  }

  if (typeof window !== 'undefined') {
    //@ts-ignore

    useEffect(() => {
      handleDataFetching();
    }, [toolClicked]);
  }

  // if (typeof window !== 'undefined') {
  //   useEffect(() => {
  //     const source = new InterfaceIntegration(new DatabaseService());
  //     source.getProjectBasedSourceCode(router.query.id as string);
  //     const sourceCode = source.getProjectBasedSourceCode(
  //       router.query.id as string
  //     );
  //     if (localStorage.getItem(General.LOCAL_DB_NAME)) {
  //       setCurrentSource(sourceCode);
  //       console.log(sourceCode);
  //     } else return setCurrentSource('');
  //   }, [localStorage.getItem(General.LOCAL_DB_NAME)]);
  // }

  return (
    <motion.div className="w-full bg-interface-bg">
      <motion.div
        animate={{ opacity: [0, 1], y: [10, 0] }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="h-[95%]"
      >
        <p className="flex justify-center mt-10 text-[50px] welcome-color">
          SlobyBuilder
        </p>

        <div className="ml-2 mt-3 flex flex-col gap-4">
          <JsxParser jsx={currentSource} components={{ Input }} />
        </div>
      </motion.div>
    </motion.div>
  );
}
