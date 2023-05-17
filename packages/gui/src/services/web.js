import { query } from "@/services/graphql";

export async function getWebsiteTotal() {
  return query(`websites{
		meta{pagination{total}}
	}`);
}

export default {
  getWebsiteTotal
};
