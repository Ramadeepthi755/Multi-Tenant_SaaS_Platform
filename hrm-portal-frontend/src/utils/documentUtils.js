const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",

  "image/jpeg",
  "image/png",
  "image/webp",

  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "text/plain"
];

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".txt"
];


// =========================================================
// FORMAT FILE SIZE
// =========================================================

export const formatFileSize = (
  bytes
) => {

  if (
    !bytes ||
    bytes <= 0
  ) {
    return "0 Bytes";
  }


  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];


  const index =
    Math.floor(
      Math.log(bytes) /
      Math.log(1024)
    );


  return `${(
    bytes /
    Math.pow(
      1024,
      index
    )
  ).toFixed(
    index === 0
      ? 0
      : 1
  )} ${units[index]}`;
};


// =========================================================
// FILE EXTENSION
// =========================================================

export const getFileExtension = (
  fileName = ""
) => {

  const lastDot =
    fileName.lastIndexOf(".");


  if (
    lastDot === -1
  ) {
    return "";
  }


  return fileName
    .substring(lastDot)
    .toLowerCase();
};


// =========================================================
// FILE NAME WITHOUT EXTENSION
// =========================================================

export const getFileNameWithoutExtension = (
  fileName = ""
) => {

  const extension =
    getFileExtension(
      fileName
    );


  if (!extension) {
    return fileName;
  }


  return fileName.slice(
    0,
    -extension.length
  );
};


// =========================================================
// IS PREVIEWABLE
// =========================================================

export const isPreviewableFile = (
  file
) => {

  if (!file) {
    return false;
  }


  const type =
    file.type ||
    file.contentType ||
    "";


  const name =
    file.name ||
    file.fileName ||
    "";


  return (
    type === "application/pdf" ||
    type.startsWith("image/") ||
    /\.(pdf|png|jpg|jpeg|webp)$/i.test(
      name
    )
  );
};


// =========================================================
// IS IMAGE
// =========================================================

export const isImageFile = (
  file
) => {

  if (!file) {
    return false;
  }


  const type =
    file.type ||
    file.contentType ||
    "";


  const name =
    file.name ||
    file.fileName ||
    "";


  return (
    type.startsWith("image/") ||
    /\.(png|jpg|jpeg|webp)$/i.test(
      name
    )
  );
};


// =========================================================
// VALIDATE FILE
// =========================================================

export const validateDocumentFile = (
  file
) => {

  if (!file) {

    return {
      valid: false,
      message:
        "Please select a file."
    };

  }


  if (
    file.size >
    MAX_FILE_SIZE
  ) {

    return {
      valid: false,
      message:
        "File size must not exceed 10 MB."
    };

  }


  const extension =
    getFileExtension(
      file.name
    );


  const typeAllowed =
    ALLOWED_FILE_TYPES.includes(
      file.type
    );


  const extensionAllowed =
    ALLOWED_EXTENSIONS.includes(
      extension
    );


  if (
    !typeAllowed &&
    !extensionAllowed
  ) {

    return {
      valid: false,
      message:
        "This file type is not supported."
    };

  }


  return {
    valid: true,
    message: ""
  };

};


// =========================================================
// DOWNLOAD BLOB
// =========================================================

export const downloadBlob = (
  blob,
  fileName
) => {

  const url =
    window.URL.createObjectURL(
      blob
    );


  const anchor =
    document.createElement(
      "a"
    );


  anchor.href = url;
  anchor.download =
    fileName ||
    "document";


  document.body.appendChild(
    anchor
  );


  anchor.click();


  anchor.remove();


  window.URL.revokeObjectURL(
    url
  );

};


export {
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  ALLOWED_EXTENSIONS
};