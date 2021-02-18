(() => {
  const sidebarElement = document.querySelector('.sidebar');
  const resizeArea = document.createElement('div');
  resizeArea.classList.add('sidebar-resize-area');

  let startResizePosition = 0;
  let startWidth = 0;

  const computedStyle = getComputedStyle(document.documentElement);
  const width = parseInt(computedStyle.getPropertyValue('--sidebar-width'));
  const maxWidth = parseInt(computedStyle.getPropertyValue('--sidebar-max-width'));

  resizeArea.addEventListener('pointerdown', e => {
    startResizePosition = e.clientX;
    startWidth = sidebarElement.clientWidth;
    document.documentElement.addEventListener('pointermove', handleResize);
    document.documentElement.style.setProperty('--user-select', 'none');
    document.documentElement.addEventListener('pointerup', handleEndResize);
  });

  // const handleResize = e => {
  //   const diff = e.clientX - startResizePosition;
  //   startResizePosition = e.clientX;
  //
  //   sidebarElement.style.width = Math.max(sidebarElement.clientWidth - diff, 250) + 'px';
  // }

  const handleResize = e => {
    const diff = e.clientX - startResizePosition;
    const newSize = startWidth - diff;
    document.documentElement.style.setProperty('--sidebar-width', Math.min(Math.max(newSize, width), maxWidth) + 'px');
  }

  const handleEndResize = e => {
    document.documentElement.style.setProperty('--user-select', 'text');
    document.documentElement.removeEventListener('pointermove', handleResize);
    document.documentElement.removeEventListener('pointerup', handleEndResize);
  }

  sidebarElement.appendChild(resizeArea);

  const tabs = document.querySelectorAll('.sidebar-tab');
  const contents = document.querySelectorAll('.sidebar-content');

  const setActiveTab = (id) => {
    tabs.forEach(tab => {
      tab.classList[id === tab.dataset.id ? 'add' : 'remove']('active');
    })
    contents.forEach(content => {
      content.classList[id === content.dataset.id ? 'add' : 'remove']('active');
    })
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setActiveTab(tab.dataset.id);
    });
  })

  setActiveTab('global');
})();

