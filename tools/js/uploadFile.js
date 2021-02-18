const uploadFile = async (files, folder, callback) => {
  for (file of files) {
    const formData = new FormData();
    formData.append('folder', folder);
    formData.append('file', file);
    const response = await fetch('http://localhost:8080/server/upload-file', {
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
