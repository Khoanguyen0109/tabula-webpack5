const IMAGE_EXTENSION_NOT_SUPPORTED = [
    'heic',
    'tiff',
    'tif'
];

export const checkLoadImageSupport = (filename) => {
    const extension = filename.split('.').pop();
    if(IMAGE_EXTENSION_NOT_SUPPORTED.includes(extension)){
        return false;
    };
    return true;

};