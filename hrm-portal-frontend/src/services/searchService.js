import api from "./api";

const searchService = {

  async globalSearch(
    query,
    options = {}
  ) {

    const {
      page = 0,
      size = 20,
      type = "ALL"
    } = options;

    const response = await api.get(
      "/search",
      {
        params: {
          query,
          page,
          size,
          type
        }
      }
    );

    return response.data;
  }

};

export default searchService;