import { IEndpointElement, IAppConfig } from "./types";

const app: IAppConfig = {
  apiUrl: "http://localhost:3300"
};

const endpoints: IEndpointElement[] = [
  {
    name: "Peoples",
    edit: {
      required: [],
      exclude: [
        "_id",
        "__v",
        "lastFirstName",
        "firstLastName"
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
    },
    print: {
      required: [],
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
    name: "Tools",
    edit: {
      required: ["definition", "name", "confluence"],
      exclude: [],
      alias: [],
    }
  },
  {
    name: "Users"
  }
];

export { endpoints, app };