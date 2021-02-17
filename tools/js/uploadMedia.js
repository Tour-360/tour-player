const uploadMedia = async (files, callback) => {
  console.log('uploadMedia');

  for (file of files) {
    const formData = new FormData();
    formData.append('media', file);
    console.log('file', file.name);
    const response = await fetch('http://localhost:8080/server/upload-media', {
      method: 'POST',
      body: formData,
    });
    const json = await response.json();
    if (json.success) {
      toasts.push(`File ${file.name} has ben loaded`);
      callback(json);
    } else {
      toasts.push(json.error);
    }
  }
}
