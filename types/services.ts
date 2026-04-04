/**
 * Service entry type — shared between server and client.
 * Duplicated here to avoid importing from server-only module.
 */
export interface ServiceEntry {
  key: string;
  name: string;
  icon: string;
  iconLibrary: string;
  type?: 'new';
}
