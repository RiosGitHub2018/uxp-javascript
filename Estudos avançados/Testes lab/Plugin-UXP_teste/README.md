///// CRIAR PROJETO
npx @swc-uxp-wrappers/create-swc-uxp-app meu-plugin-uxp
cd meu-plugin-uxp
/////:::::::::::::::::::

///// INSTALR DEPENDENCIAS
npm i @swc-uxp-wrappers/create-swc-uxp-app
yarn add @spectrum-web-components/theme
yarn install

///// COMPILAR
yarn build

//////SOLUCIONAR ERROS DE BILD:::
yarn add @spectrum-web-components/theme
• Limpe o Cache do Yarn: Às vezes, o cache do Yarn pode causar problemas. Tente limpá-lo com:
  yarn cache clean

• Desisntalr dependecias
  Remove-Item -Recurse -Force node_modules
  Remove-Item yarn.lock

• Reinstalar dependecias
  yarn install'

  ////// AO EXECUTAR O PROJETO EM MAQUINAS DIFERENTE 
  É PRECISO INSTALAR O YARN GLOBALMENTE (NO SISTEMA,)
  npm install -g yarn

