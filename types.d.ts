// types.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // ajoutez vos variables d'environnement ici si nécessaire
  }
}

type PageProps = {
  params: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};
