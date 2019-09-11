import { IEndpointElement, IAppConfig } from './types';

const app: IAppConfig = {
  apiUrl: "http://localhost:3300"
}

const endpoints: IEndpointElement[] = [
  {
    name: "Peoples",
    print: {
      exclude: [
        "_id",
        "__v",
        "lastFirstName",
        "firstLastName",
        "picturePro"
      ],
      alias: [
        {
          value: "lastName",
          alias: "Nom",
          order: 0
        },
        {
          value: "firstName",
          alias: "Prénom",
          order: 1
        }
      ]
    }
  },
  {
    name: "Tools"
  },
  {
    name: "Users"
  }
];

export {
  endpoints,
  app
};