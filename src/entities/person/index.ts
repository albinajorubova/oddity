export {
  createPerson,
  findOrCreatePersonByName,
  getPersonByName,
  STRAPI_PERSON_COLLECTION,
} from "./api";
export { mapStrapiToPerson, parseArtistNames, slugFromPersonName } from "./lib";
export type { Person, PersonRef, WorkType } from "./model";
export { getPersonLabel } from "./model";
