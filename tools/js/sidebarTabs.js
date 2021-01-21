(() => {
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

