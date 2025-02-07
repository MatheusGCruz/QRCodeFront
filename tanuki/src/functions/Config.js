import { useState } from 'react';

const useConfigs = () => {
  const [config] = useState({
        tanukiApi:"https://api.antares.ninja/Tanuki/",
        tanukiBaseUrl:"https://tanuki.click/"
  });

  return config;
};

export default useConfigs;