import api from "./api";

import {
  downloadBlob
} from "../utils/documentUtils";


const documentService = {

  // =========================================================
  // LIST
  // =========================================================

  async getDocuments(
    params = {}
  ) {

    const response =
      await api.get(
        "/documents",
        {
          params
        }
      );

    return response.data;
  },


  // =========================================================
  // GET BY ID
  // =========================================================

  async getDocumentById(
    documentId
  ) {

    const response =
      await api.get(
        `/documents/${documentId}`
      );

    return response.data;
  },


  // =========================================================
  // UPLOAD
  // =========================================================

  async uploadDocument(
    file,
    metadata = {},
    onProgress
  ) {

    const formData =
      new FormData();


    formData.append(
      "file",
      file
    );


    Object.entries(
      metadata
    ).forEach(
      ([key, value]) => {

        if (
          value !== undefined &&
          value !== null
        ) {

          formData.append(
            key,
            value
          );

        }

      }
    );


    const response =
      await api.post(
        "/documents",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          },

          onUploadProgress:
            progressEvent => {

              if (
                !progressEvent.total
              ) {
                return;
              }


              const percent =
                Math.round(
                  (
                    progressEvent.loaded /
                    progressEvent.total
                  ) * 100
                );


              onProgress?.(
                percent
              );

            }
        }
      );


    return response.data;
  },


  // =========================================================
  // DOWNLOAD
  // =========================================================

  async downloadDocument(
    documentId,
    fileName
  ) {

    const response =
      await api.get(
        `/documents/${documentId}/download`,
        {
          responseType:
            "blob"
        }
      );


    downloadBlob(
      response.data,
      fileName
    );


    return true;
  },


  // =========================================================
  // DELETE
  // =========================================================

  async deleteDocument(
    documentId
  ) {

    const response =
      await api.delete(
        `/documents/${documentId}`
      );

    return response.data;
  },


  // =========================================================
  // PREVIEW
  // =========================================================

  async previewDocument(
    documentId
  ) {

    const response =
      await api.get(
        `/documents/${documentId}/download`,
        {
          responseType:
            "blob"
        }
      );


    return response.data;
  }

};


export default documentService;