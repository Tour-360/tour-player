class DB {
  static init(tour) {
    window.db = new DB(tour.db);
  }

  constructor(config) {
    this.config = config;
    this.tables = {};
    if (this.config) {
      this.load();
    } else {
      console.error("Plugin DB: tour.db config not specified");
    }
  }

  getLang(record, key, options) {
    const lang = Lang.language;
    const string = record[`${key}_${lang}`] || record[key] || record[`${key}_en`] || record[`${key}_ru`] || '';
    return this.prepareLangString(string, options);
  }

  getById(table, id) {
    return table.find(r => r.id == id);
  }

  getByHash(table, hash) {
    return table.find(r => r._id === hash);
  }

  getLangKey(table = [], key, options) {
    const record = table.find(r => r.key === key);
    const string = record ? (record[Lang.language] || record['en'] || record['ru']) : key;
    return this.prepareLangString(string, options);
  }

  prepareLangString(string, options = {}) {
    let result = string || '';
    options = {
      ...options,
      lang: Lang.language.toUpperCase(),
    }
    Object.keys(options).forEach(key => {
      result = result.replaceAll(`{${key}}`, options[key]);
    })
    return result;
  }

  langRender() {
    document.querySelectorAll('body *[data-lang]').forEach(element => {
      element.innerHTML = this.getLangKey(this.tables.langs, element.dataset.lang);
    });
  }

  load() {
    const { dev } = Tour.query.get();
    dev && console.time('db');
    const { base, tables } = this.config;
    Promise.all(
      tables.map(table => fetch(
        dev ?
          `https://tour-360.ru/airtable/base/${base}/${table}` :
          `tables/${table}.json`
      ).then(r => r.json()))
    ).then((responses) => {
      responses.forEach((table, index) => {
        table.getById = id => this.getById(table, id);
        table.getByHash = hash => this.getByHash(table, hash);
        table.forEach((record) => {
          record.getLang = (key) => this.getLang(record, key);
        });
        this.tables[tables[index]] = table;
      });
      if (db.tables.langs) {
        Lang.getKey = (key, options) => this.getLangKey(this.tables.langs, key, options);
        Tour.on('changelang', this.langRender.bind(this))
        Lang.render = this.langRender.bind(this);
        Lang.render();
      }
      Tour.emmit('db', this.tables);
      dev && console.timeEnd('db');
    });
  }
}
