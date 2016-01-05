/* globals UI */

UI.controlPanel = {};

UI.controlPanel.init = function() {
    this.progressValue = document.createElement('div');
    this.progressValue.className = 'value';

    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress-bar';
    this.progressBar.appendChild(this.progressValue);

    this.btnList = document.createElement('div');
    this.btnList.className = 'btn-list';

    this.element = document.createElement('div');
    this.element.id = 'control-panel';
    this.element.appendChild(this.progressBar);
    this.element.appendChild(this.btnList);

    document.body.appendChild(this.element);
    this.setProgress(0);
};

UI.controlPanel.addBtn = function(className, callback, title) {
    var btn = document.createElement('div');
    btn.classList.add('marker', className);
    btn.addEventListener('click', callback, false);
    btn.title = title || '';
    this.btnList.appendChild(btn);
    this.element.style.width = this.btnList.children[0].clientWidth * this.btnList.children.length + 'px';
};

UI.controlPanel.setProgress = function(value) {
    if (value >= 1 || value == 1) {
        this.progressBar.classList.add('hidden');
    } else {
        this.progressBar.classList.remove('hidden');
    }

    this.progressValue.style.width = Math.min(value, 1) * 100 + '%';
};
