(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const COLORS = { point: '#18211c', linear: '#23664a', proportional: '#d47642', quadratic: '#8058a5', smooth: '#3973aa', horizontal: '#b05252', vertical: '#9b6b20', grid: '#d6ddd7', minor: '#e9eee9' };
  const demoRows = [
    { x: 0, dx: .2, y: 1, dy: .1 }, { x: 5, dx: .2, y: 3.3, dy: .1 },
    { x: 8, dx: .2, y: 5.1, dy: .5 }, { x: 10, dx: .4, y: 5.3, dy: .5 },
    { x: 12, dx: .4, y: 6.5, dy: .5 }, { x: 14, dx: .4, y: 7.2, dy: .5 },
    { x: 16, dx: .4, y: 8.2, dy: .5 }
  ];
  const defaults = {
    layoutVersion: 4,
    rows: demoRows, chartTitle: 'Current versus voltage', xLabel: 'Voltage', xUnit: 'V',
    yLabel: 'Current', yUnit: 'A', fitLinear: true, fitProportional: false, fitQuadratic: false, fitSmooth: false,
    fitHorizontal: false, fitVertical: false,
    paper: 'millimeter', orientation: 'landscape', gridIntensity: '1', showLegend: false, autoScale: true,
    xMin: '0', xMax: '20', xStep: '5', yMin: '0', yMax: '10', yStep: '2'
  };
  const TEXT = {
    ru: {
      appName:'ЛабГраф', shutdown:'Выключить', newGraph:'Новый график', downloadA4:'Скачать A4', data:'Данные', design:'Оформление', export:'Экспорт',
      step1:'Шаг 1', experimentalData:'Экспериментальные данные', addRow:'Добавить строку', clear:'Очистить', pasteTable:'Вставить таблицу', sortX:'Сортировать X', undo:'Отменить', redo:'Вернуть',
      sameError:'Одинаковая погрешность', allPoints:'для всех точек', apply:'Применить', decimalHint:'Десятичные запятые поддерживаются. Погрешности можно оставить пустыми.',
      step2:'Шаг 2', labelsDesign:'Подписи и оформление', chartTitle:'Название графика', xAxis:'Ось X: величина', xUnit:'Единица X', yAxis:'Ось Y: величина', yUnit:'Единица Y', approximation:'Аппроксимация',
      linear:'Линейная', proportional:'Прямая пропорциональность', quadratic:'Квадратичная', smooth:'Плавная интерполяция', unknownDependency:'Для неизвестной зависимости', constantLines:'Горизонтальная и вертикальная линии', horizontalLine:'Горизонтальная', verticalLine:'Вертикальная', automatic:'среднее', constantHint:'Линии автоматически строятся по среднему X или Y.', background:'Фон', white:'Белый', coordinateGrid:'Координатная сетка', graphPaper:'Миллиметровка',
      pageFormat:'Формат листа', landscape:'A4, альбомный', portrait:'A4, книжный', gridContrast:'Контраст миллиметровки', soft:'Мягкая', clearGrid:'Чёткая', showLegend:'Показывать легенду', aboveChart:'Над областью графика', axisLimits:'Границы и деления осей', autoScale:'Автоматический масштаб', minimum:'Минимум', maximum:'Максимум', step:'Шаг',
      step3:'Шаг 3', downloadResult:'Скачать результат', vector:'Векторный', sourceData:'Исходные данные', saveProject:'Сохранить проект', openProject:'Открыть проект', pdfCalibrated:'PDF уже откалиброван:', pdfNote:'лист A4, клетка 1 мм. При печати используйте масштаб 100%.', preview:'Предпросмотр', updatesLive:'Обновляется сразу',
      readyPrint:'График готов к печати', qualityGood:'Все точки находятся внутри осей, число делений удобно для чтения.', quickInput:'Быстрый ввод', pasteHeading:'Вставьте таблицу', pasteHelp:'Скопируйте 2–4 столбца из Excel или Google Таблиц: X, ΔX, Y, ΔY. При двух столцах они считаются X и Y.', cancel:'Отмена', loadData:'Загрузить данные',
      saved:'Сохранено', saving:'Сохраняю…', linearFit:'Линейная аппроксимация', proportionalFit:'Прямая пропорциональность', quadraticFit:'Квадратичная аппроксимация', interpolation:'Интерполяция', experimentalPoints:'экспериментальных точек', copy:'Копировать', chartFallback:'График экспериментальных данных', chartDescription:'Экспериментальный график: {count} точек', calibration:'контроль 10 мм'
    },
    en: {
      appName:'LabGraph', shutdown:'Quit', newGraph:'New graph', downloadA4:'Download A4', data:'Data', design:'Design', export:'Export', step1:'Step 1', experimentalData:'Experimental data', addRow:'Add row', clear:'Clear', pasteTable:'Paste table', sortX:'Sort by X', undo:'Undo', redo:'Redo', sameError:'Common uncertainty', allPoints:'for all points', apply:'Apply', decimalHint:'Decimal commas are supported. Uncertainties may be left blank.',
      step2:'Step 2', labelsDesign:'Labels and design', chartTitle:'Chart title', xAxis:'X axis: quantity', xUnit:'X unit', yAxis:'Y axis: quantity', yUnit:'Y unit', approximation:'Curve fitting', linear:'Linear', proportional:'Direct proportion', quadratic:'Quadratic', smooth:'Smooth interpolation', unknownDependency:'For an unknown relationship', constantLines:'Horizontal and vertical lines', horizontalLine:'Horizontal', verticalLine:'Vertical', automatic:'mean', constantHint:'Lines are calculated automatically from the mean X or Y.', background:'Background', white:'White', coordinateGrid:'Coordinate grid', graphPaper:'Graph paper', pageFormat:'Page format', landscape:'A4, landscape', portrait:'A4, portrait', gridContrast:'Graph paper contrast', soft:'Soft', clearGrid:'Strong', showLegend:'Show legend', aboveChart:'Above the plot area', axisLimits:'Axis limits and ticks', autoScale:'Automatic scale', minimum:'Minimum', maximum:'Maximum', step:'Step',
      step3:'Step 3', downloadResult:'Download result', vector:'Vector', sourceData:'Source data', saveProject:'Save project', openProject:'Open project', pdfCalibrated:'PDF is calibrated:', pdfNote:'A4 page, 1 mm grid. Print at 100% scale.', preview:'Preview', updatesLive:'Updates instantly', readyPrint:'Chart is ready to print', qualityGood:'All points are inside the axes and the tick count is easy to read.', quickInput:'Quick input', pasteHeading:'Paste a table', pasteHelp:'Copy 2–4 columns from Excel or Google Sheets: X, ΔX, Y, ΔY. Two columns are treated as X and Y.', cancel:'Cancel', loadData:'Load data',
      saved:'Saved', saving:'Saving…', linearFit:'Linear fit', proportionalFit:'Direct proportion', quadraticFit:'Quadratic fit', interpolation:'Interpolation', experimentalPoints:'experimental points', copy:'Copy', chartFallback:'Experimental data chart', chartDescription:'Experimental chart with {count} points', calibration:'10 mm check'
    }
  };
  Object.assign(TEXT.ru,{
    deleteRow:'Удалить строку {number}', row:'строка', loadDemoTitle:'Загрузить пример', addTwoPoints:'Добавьте минимум две экспериментальные точки.', checkAxes:'Проверьте ручные границы и шаг осей.', tickAdvice:'Рекомендуется 5–10 подписанных делений на каждой оси.', outsidePoints:'Некоторые экспериментальные точки выходят за границы осей.', recommendations:'Есть рекомендации',
    enterUncertainty:'Введите ΔX или ΔY', invalidUncertainty:'Погрешность должна быть неотрицательным числом', errorsApplied:'Погрешности применены ко всем точкам', tableCleared:'Таблица очищена', demoLoaded:'Пример загружен', newGraphCreated:'Создан новый график', pasteFailed:'Не удалось распознать строки', rowsLoaded:'Загружено строк: {count}', fileReadFailed:'Не удалось прочитать файл', noNumericData:'В файле не найдены числовые данные', pointsImported:'Импортировано точек: {count}', sorted:'Точки отсортированы по X', actionUndone:'Действие отменено', actionRedone:'Действие возвращено',
    projectSaved:'Проект сохранён', projectOpened:'Проект открыт', invalidProject:'Это не файл проекта ЛабГраф', svgDownloaded:'SVG A4 скачан', pngDownloaded:'PNG 300 dpi скачан', pdfPreparing:'Готовлю PDF A4…', pdfDownloaded:'PDF A4 скачан', pdfFailed:'Не удалось создать PDF', csvDownloaded:'CSV с данными скачан', downloadFailed:'Браузер не позволил сохранить файл', storageFailed:'Не удалось автосохранить данные', copied:'Результат скопирован', copyFailed:'Не удалось скопировать', shutdownConfirm:'Выключить ЛабГраф? Сохранённые в браузере данные не пропадут.', stoppedTitle:'ЛабГраф выключен', stoppedText:'Локальный сервер остановлен. Эту вкладку можно закрыть.', settingsLabel:'Настройки графика', sectionsLabel:'Разделы настроек', dataTableLabel:'Таблица экспериментальных данных', previewLabel:'Предпросмотр графика', chartAria:'График экспериментальных данных', close:'Закрыть', noValidPoints:'Нет готовых точек — заполните X и Y.', dataSummary:'Точек: {count} · X: {xmin}–{xmax} · Y: {ymin}–{ymax}', horizontalFit:'Горизонтальная линия', verticalFit:'Вертикальная линия', calculated:'среднее', constantOutside:'Заданная постоянная линия находится за границами осей.'
  });
  Object.assign(TEXT.en,{
    deleteRow:'Delete row {number}', row:'row', loadDemoTitle:'Load example', addTwoPoints:'Add at least two experimental points.', checkAxes:'Check the manual axis limits and step.', tickAdvice:'Use 5–10 labeled ticks on each axis.', outsidePoints:'Some experimental points are outside the axis limits.', recommendations:'Recommendations',
    enterUncertainty:'Enter ΔX or ΔY', invalidUncertainty:'Uncertainty must be a non-negative number', errorsApplied:'Uncertainties applied to all points', tableCleared:'Table cleared', demoLoaded:'Example loaded', newGraphCreated:'New graph created', pasteFailed:'No valid rows were recognized', rowsLoaded:'Rows loaded: {count}', fileReadFailed:'Could not read the file', noNumericData:'No numeric data found in the file', pointsImported:'Points imported: {count}', sorted:'Points sorted by X', actionUndone:'Action undone', actionRedone:'Action restored',
    projectSaved:'Project saved', projectOpened:'Project opened', invalidProject:'This is not a valid LabGraph project file', svgDownloaded:'A4 SVG downloaded', pngDownloaded:'300 dpi PNG downloaded', pdfPreparing:'Preparing A4 PDF…', pdfDownloaded:'A4 PDF downloaded', pdfFailed:'Could not create the PDF', csvDownloaded:'Data CSV downloaded', downloadFailed:'The browser could not save the file', storageFailed:'Could not autosave the data', copied:'Result copied', copyFailed:'Could not copy the result', shutdownConfirm:'Quit LabGraph? Data saved in the browser will be preserved.', stoppedTitle:'LabGraph has quit', stoppedText:'The local server has stopped. You may close this tab.', settingsLabel:'Chart settings', sectionsLabel:'Settings sections', dataTableLabel:'Experimental data table', previewLabel:'Chart preview', chartAria:'Experimental data chart', close:'Close', noValidPoints:'No complete points yet — enter X and Y.', dataSummary:'Points: {count} · X: {xmin}–{xmax} · Y: {ymin}–{ymax}', horizontalFit:'Horizontal line', verticalFit:'Vertical line', calculated:'mean', constantOutside:'A constant line is outside the current axis limits.'
  });
  Object.assign(TEXT.ru,{invalidConstant:'Значение горизонтальной или вертикальной линии должно быть числом.',swapAxes:'Поменять X и Y местами',axesSwapped:'Оси X и Y поменяны местами',viewChart:'График',dropHint:'Можно перетащить CSV/TSV-файл прямо сюда',nextDesign:'Далее: оформление',nextExport:'Далее: скачать',autoTitle:'Авто',pasteClipboard:'Вставить из буфера',clipboardLoaded:'Данные из буфера вставлены',clipboardFailed:'Не удалось прочитать буфер обмена',fileDropped:'Файл загружен: {count} точек',autoTitleMade:'Название создано по подписям осей',resetConfirm:'Начать новый график? Текущие данные будут заменены.',help:'Помощь',shortcuts:'Горячие клавиши',shortcutSave:'Сохранить проект',shortcutOpen:'Открыть проект',shortcutPdf:'Скачать PDF',shortcutUndo:'Отменить / вернуть',shortcutNext:'Перейти к следующей ячейке',understood:'Понятно',resultsEmpty:'Выберите аппроксимацию или постоянную линию — результат появится здесь.'});
  Object.assign(TEXT.en,{invalidConstant:'A horizontal or vertical line value must be numeric.',swapAxes:'Swap X and Y',axesSwapped:'X and Y axes swapped',viewChart:'Chart',dropHint:'You can drop a CSV/TSV file here',nextDesign:'Next: design',nextExport:'Next: download',autoTitle:'Auto',pasteClipboard:'Paste from clipboard',clipboardLoaded:'Clipboard data pasted',clipboardFailed:'Could not read the clipboard',fileDropped:'File loaded: {count} points',autoTitleMade:'Title created from the axis labels',resetConfirm:'Start a new chart? The current data will be replaced.',help:'Help',shortcuts:'Keyboard shortcuts',shortcutSave:'Save project',shortcutOpen:'Open project',shortcutPdf:'Download PDF',shortcutUndo:'Undo / redo',shortcutNext:'Move to the next cell',understood:'Got it',resultsEmpty:'Choose a fit or a constant line and its result will appear here.'});
  const META = {
    ru:{chartTitle:'Зависимость силы тока от напряжения',xLabel:'Напряжение',xUnit:'В',yLabel:'Сила тока',yUnit:'А'},
    en:{chartTitle:'Current versus voltage',xLabel:'Voltage',xUnit:'V',yLabel:'Current',yUnit:'A'}
  };
  let language=localStorage.getItem('labgraph-language')==='ru'?'ru':'en';
  let theme=localStorage.getItem('labgraph-theme')==='light'?'light':'dark';
  function t(key,vars={}){
    let value=(TEXT[language]&&TEXT[language][key])||TEXT.ru[key]||key;
    Object.keys(vars).forEach(name=>{value=value.replaceAll(`{${name}}`,vars[name]);});
    return value;
  }
  let state = loadState();
  let zoom = 1;
  let saveTimer;
  const undoStack = [], redoStack = [];
  let editSnapshot = null;

  function loadState() {
    try {
      const saved=JSON.parse(localStorage.getItem('labgraph-state') || '{}');
      const merged={...defaults,...saved};
      delete merged.horizontalValue;delete merged.verticalValue;
      if(saved.layoutVersion!==defaults.layoutVersion) merged.showLegend=false;
      merged.layoutVersion=defaults.layoutVersion;
      return merged;
    }
    catch (_) { return structuredClone(defaults); }
  }
  function cloneDefaults() { return JSON.parse(JSON.stringify(defaults)); }
  function cloneState(value=state) { return JSON.parse(JSON.stringify(value)); }
  function applyLanguage(){
    document.documentElement.lang=language;
    document.querySelectorAll('[data-i18n]').forEach(element=>{element.textContent=t(element.dataset.i18n);});
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element=>{element.placeholder=t(element.dataset.i18nPlaceholder);});
    $('langBtn').textContent=language==='ru'?'EN':'RU';
    $('langBtn').title=language==='ru'?'Switch to English':'Переключить на русский';
    $('shutdownBtn').title=language==='ru'?'Остановить локальный сервер':'Stop the local server';
    $('loadDemoBtn').title=t('loadDemoTitle');
    $('helpBtn').title=t('shortcuts');
    $('helpBtn').setAttribute('aria-label',t('shortcuts'));
    updateThemeButton();
    document.querySelector('.controls').setAttribute('aria-label',t('settingsLabel'));
    document.querySelector('.steps').setAttribute('aria-label',t('sectionsLabel'));
    document.querySelector('.data-table').setAttribute('aria-label',t('dataTableLabel'));
    document.querySelector('.preview-area').setAttribute('aria-label',t('previewLabel'));
    $('chart').setAttribute('aria-label',t('chartAria'));
    document.querySelectorAll('dialog .icon-button').forEach(button=>button.setAttribute('aria-label',t('close')));
    document.title=language==='ru'?'ЛабГраф — графики эксперимента':'LabGraph — experimental charts';
  }
  function updateThemeButton(){
    const dark=theme==='dark';
    const label=language==='ru'
      ?(dark?'Включить светлую тему':'Включить тёмную тему')
      :(dark?'Switch to light theme':'Switch to dark theme');
    const button=$('themeBtn');
    button.textContent=dark?'☀':'☾';
    button.title=label;
    button.setAttribute('aria-label',label);
    button.setAttribute('aria-pressed',String(dark));
  }
  function applyTheme(){
    document.documentElement.dataset.theme=theme;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=theme==='dark'?'#0e1411':'#ffffff';
    updateThemeButton();
  }
  function switchTheme(){
    theme=theme==='dark'?'light':'dark';
    localStorage.setItem('labgraph-theme',theme);
    applyTheme();
  }
  function switchLanguage(){
    const previous=language, next=language==='ru'?'en':'ru';
    Object.keys(META[previous]).forEach(key=>{if(state[key]===META[previous][key])state[key]=META[next][key];});
    language=next;
    localStorage.setItem('labgraph-language',language);
    applyLanguage();
    syncControls();
    persistState();
  }
  function checkpoint(snapshot=cloneState()) {
    undoStack.push(snapshot);
    if(undoStack.length>60) undoStack.shift();
    redoStack.length=0;
    updateHistoryButtons();
  }
  function updateHistoryButtons(){
    $('undoBtn').disabled=!undoStack.length;
    $('redoBtn').disabled=!redoStack.length;
  }
  function restoreHistory(from,to,message){
    if(!from.length)return;
    to.push(cloneState());
    state=from.pop();
    syncControls();
    updateHistoryButtons();
    toast(message);
  }
  function num(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    const normalized=String(value ?? '').trim().replace(',', '.');
    if(!normalized)return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function fmt(n, digits = 4) {
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString(language==='ru'?'ru-RU':'en-US', {
      useGrouping: false,
      notation: 'standard',
      maximumSignificantDigits: digits
    });
  }
  function axisName(label, unit) { return unit.trim() ? `${label}, ${unit}` : label; }
  function lineEquation(fit, throughZero=false) {
    if(!fit) return '';
    const k=fmt(fit.k,4);
    if(throughZero) return `y = ${k}x`;
    const sign=fit.b>=0?' + ':' − ';
    return `y = ${k}x${sign}${fmt(Math.abs(fit.b),4)}`;
  }

  function syncControls() {
    ['chartTitle','xLabel','xUnit','yLabel','yUnit','paper','orientation','gridIntensity','xMin','xMax','xStep','yMin','yMax','yStep'].forEach(id => $(id).value = state[id]);
    ['fitLinear','fitProportional','fitQuadratic','fitSmooth','fitHorizontal','fitVertical','showLegend','autoScale'].forEach(id => $(id).checked = !!state[id]);
    $('axisFields').classList.toggle('disabled', state.autoScale);
    $('paperSheet').className = `paper-sheet ${state.orientation}`;
    renderRows();
    update();
  }

  function renderRows() {
    $('dataBody').innerHTML = state.rows.map((r, i) => `<tr data-row="${i}">
      <td>${i + 1}</td>
      ${['x','dx','y','dy'].map(k => `<td><input inputmode="decimal" aria-label="${k.toUpperCase()}, ${t('row')} ${i+1}" data-key="${k}" value="${esc(r[k] ?? '')}"></td>`).join('')}
      <td><button class="delete-row" type="button" aria-label="${t('deleteRow',{number:i+1})}">×</button></td></tr>`).join('');
  }

  function validRows() {
    return state.rows.map(r => ({ x: num(r.x), dx: Math.abs(num(r.dx) ?? 0), y: num(r.y), dy: Math.abs(num(r.dy) ?? 0) }))
      .filter(r => r.x !== null && r.y !== null);
  }

  function weightedLinear(rows, throughZero) {
    if (rows.length < (throughZero ? 1 : 2)) return null;
    const ws = rows.map(r => r.dy > 0 ? 1 / (r.dy * r.dy) : 1);
    if (throughZero) {
      const sxx = rows.reduce((s,r,i) => s + ws[i]*r.x*r.x, 0);
      if (!sxx) return null;
      const k = rows.reduce((s,r,i) => s + ws[i]*r.x*r.y, 0) / sxx;
      const rss = rows.reduce((s,r,i) => s + ws[i]*Math.pow(r.y-k*r.x,2), 0);
      const scale = rows.length > 1 ? rss/(rows.length-1) : 1;
      return { k, b: 0, sk: Math.sqrt(scale/sxx), sb: 0 };
    }
    let sw=0, sx=0, sy=0, sxx=0, sxy=0;
    rows.forEach((r,i) => { const w=ws[i]; sw+=w; sx+=w*r.x; sy+=w*r.y; sxx+=w*r.x*r.x; sxy+=w*r.x*r.y; });
    const d = sw*sxx - sx*sx;
    if (!d) return null;
    const k=(sw*sxy-sx*sy)/d, b=(sxx*sy-sx*sxy)/d;
    const rss=rows.reduce((s,r,i)=>s+ws[i]*Math.pow(r.y-k*r.x-b,2),0);
    const scale=rows.length>2?rss/(rows.length-2):1;
    return { k, b, sk: Math.sqrt(scale*sw/d), sb: Math.sqrt(scale*sxx/d) };
  }

  function solve3(matrix, vector) {
    const a=matrix.map((row,i)=>[...row,vector[i]]);
    for(let col=0;col<3;col++){
      let pivot=col;
      for(let row=col+1;row<3;row++) if(Math.abs(a[row][col])>Math.abs(a[pivot][col])) pivot=row;
      if(Math.abs(a[pivot][col])<1e-12)return null;
      [a[col],a[pivot]]=[a[pivot],a[col]];
      const divisor=a[col][col];
      for(let j=col;j<4;j++)a[col][j]/=divisor;
      for(let row=0;row<3;row++)if(row!==col){
        const factor=a[row][col];
        for(let j=col;j<4;j++)a[row][j]-=factor*a[col][j];
      }
    }
    return a.map(row=>row[3]);
  }
  function weightedQuadratic(rows){
    if(rows.length<3)return null;
    const sums=Array(5).fill(0), rhs=Array(3).fill(0);
    rows.forEach(r=>{
      const w=r.dy>0?1/(r.dy*r.dy):1;
      for(let p=0;p<=4;p++)sums[p]+=w*Math.pow(r.x,p);
      rhs[0]+=w*r.y; rhs[1]+=w*r.x*r.y; rhs[2]+=w*r.x*r.x*r.y;
    });
    const result=solve3([[sums[4],sums[3],sums[2]],[sums[3],sums[2],sums[1]],[sums[2],sums[1],sums[0]]],[rhs[2],rhs[1],rhs[0]]);
    return result?{a:result[0],b:result[1],c:result[2]}:null;
  }
  function constantValue(rows,key){
    if(!rows.length)return null;
    return {value:rows.reduce((sum,row)=>sum+row[key],0)/rows.length,automatic:true};
  }
  function rSquared(rows,predict){
    if(rows.length<2)return null;
    const mean=rows.reduce((sum,r)=>sum+r.y,0)/rows.length;
    const total=rows.reduce((sum,r)=>sum+Math.pow(r.y-mean,2),0);
    if(!total)return 1;
    const residual=rows.reduce((sum,r)=>sum+Math.pow(r.y-predict(r.x),2),0);
    return 1-residual/total;
  }
  function quadraticEquation(fit){
    if(!fit)return '';
    const sign=value=>value>=0?' + ':' − ';
    return `y = ${fmt(fit.a,4)}x²${sign(fit.b)}${fmt(Math.abs(fit.b),4)}x${sign(fit.c)}${fmt(Math.abs(fit.c),4)}`;
  }

  function niceStep(raw) {
    if (!(raw > 0)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw/p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
  }
  function autoAxis(min, max, centralMin) {
    if (min === max) { min -= Math.abs(min || 1)*.5; max += Math.abs(max || 1)*.5; }
    const pad = (max-min)*.07;
    min -= pad; max += pad;
    const step = niceStep((max-min)/7);
    let niceMin=Math.floor(min/step)*step;
    if(centralMin>=0 && niceMin<0) niceMin=0;
    return { min: niceMin, max: Math.ceil(max/step)*step, step };
  }
  function axesFor(rows) {
    if (!state.autoScale) {
      const x = { min:num(state.xMin), max:num(state.xMax), step:num(state.xStep) };
      const y = { min:num(state.yMin), max:num(state.yMax), step:num(state.yStep) };
      if (x.min !== null && x.max > x.min && x.step > 0 && y.min !== null && y.max > y.min && y.step > 0) return { x, y, manualValid:true };
    }
    if (!rows.length) return { x:{min:0,max:10,step:2}, y:{min:0,max:10,step:2}, manualValid:state.autoScale };
    const xmin=Math.min(...rows.map(r=>r.x-r.dx)), xmax=Math.max(...rows.map(r=>r.x+r.dx));
    const ymin=Math.min(...rows.map(r=>r.y-r.dy)), ymax=Math.max(...rows.map(r=>r.y+r.dy));
    return { x:autoAxis(xmin,xmax,Math.min(...rows.map(r=>r.x))), y:autoAxis(ymin,ymax,Math.min(...rows.map(r=>r.y))), manualValid:state.autoScale };
  }
  function ticks(axis) {
    const out=[]; const count=Math.min(50, Math.ceil((axis.max-axis.min)/axis.step)+1);
    for(let i=0;i<count;i++){ const v=axis.min+i*axis.step; if(v<=axis.max+axis.step*1e-7) out.push(v); }
    return out;
  }

  function smoothPath(points, X, Y) {
    if (points.length < 2) return '';
    const p = [...points].sort((a,b)=>a.x-b.x).map(v=>({x:X(v.x),y:Y(v.y)}));
    let d=`M ${p[0].x} ${p[0].y}`;
    for(let i=0;i<p.length-1;i++){
      const p0=p[i-1]||p[i], p1=p[i], p2=p[i+1], p3=p[i+2]||p2;
      const c1={x:p1.x+(p2.x-p0.x)/6,y:p1.y+(p2.y-p0.y)/6};
      const c2={x:p2.x-(p3.x-p1.x)/6,y:p2.y-(p3.y-p1.y)/6};
      d+=` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  function buildSvg() {
    const rows=validRows(), axes=axesFor(rows), xt=ticks(axes.x), yt=ticks(axes.y);
    const horizontal=constantValue(rows,'y'), vertical=constantValue(rows,'x');
    const portrait = state.orientation === 'portrait';
    const legendCount=state.showLegend?[state.fitLinear&&rows.length>1,state.fitProportional&&rows.length>0,state.fitQuadratic&&rows.length>2,state.fitSmooth&&rows.length>1,state.fitHorizontal&&horizontal,state.fitVertical&&vertical].filter(Boolean).length:0;
    const legendCols=portrait?1:3, legendRows=Math.ceil(legendCount/legendCols);
    const mm=96/25.4, pageMmW=portrait?210:297, pageMmH=portrait?297:210;
    const width=pageMmW*mm, height=pageMmH*mm;
    // Reserve enough physical space for the widest Y tick before placing the
    // vertical axis title. This prevents labels such as 150/200/250 from
    // colliding with the title while keeping the plot aligned to 5 mm blocks.
    const widestYTickMm=Math.max(...yt.map(v=>fmt(v,6).length),1)*2.05;
    const leftMm=portrait?Math.max(18,Math.min(34,11.7+widestYTickMm)):Math.max(19,Math.min(34,11.7+widestYTickMm));
    const rightMinMm=portrait?7:5, bottomMinMm=portrait?18:17;
    const topMm=legendRows?(portrait?Math.min(70,22+legendRows*6.2):20+legendRows*6.2):(portrait?20:18);
    const alignedLength=(maximum,intervals)=>{
      const count=Math.max(1,intervals);
      const step=Math.max(5,Math.floor(maximum/count/5)*5);
      return step*count;
    };
    const plotMmW=alignedLength(pageMmW-leftMm-rightMinMm,xt.length-1);
    const plotMmH=alignedLength(pageMmH-topMm-bottomMinMm,yt.length-1);
    const m={l:leftMm*mm,r:(pageMmW-leftMm-plotMmW)*mm,t:topMm*mm,b:(pageMmH-topMm-plotMmH)*mm};
    const pw=width-m.l-m.r, ph=height-m.t-m.b;
    const X=v=>m.l+(v-axes.x.min)/(axes.x.max-axes.x.min)*pw;
    const Y=v=>m.t+ph-(v-axes.y.min)/(axes.y.max-axes.y.min)*ph;
    const gridOriginX=axes.x.min<=0&&axes.x.max>=0?X(0):m.l;
    const gridOriginY=axes.y.min<=0&&axes.y.max>=0?Y(0):m.t+ph;
    const uid='g'+Math.random().toString(36).slice(2,8);
    const font="Inter,Arial,sans-serif";
    let defs=`<clipPath id="${uid}"><rect x="${m.l}" y="${m.t}" width="${pw}" height="${ph}"/></clipPath>`;
    let background=`<rect width="${width}" height="${height}" fill="#fff"/>`;
    if(state.paper==='millimeter'){
      const smallX=mm, smallY=mm;
      const bigX=smallX*5, bigY=smallY*5, strongX=smallX*10, strongY=smallY*10, level=Number(state.gridIntensity)||1;
      const minor=['','#f0f5f1','#e9f1eb','#e1ece4'][level], major=['','#dce9df','#cfdfd3','#bfd4c5'][level], ten=['','#c4d9ca','#b1ccb8','#9dbfa8'][level];
      // Draw each physical line once. Nested 1/5/10 mm patterns used to
      // overpaint the 5 mm and 10 mm boundaries, making the grid look doubled.
      const minorOffsets=[1,2,3,4,6,7,8,9];
      const minorPath=minorOffsets.map(i=>`M ${i*smallX} 0V ${strongY} M 0 ${i*smallY}H ${strongX}`).join(' ');
      const majorPath=`M ${bigX} 0V ${strongY} M 0 ${bigY}H ${strongX}`;
      const strongPath=`M 0 0V ${strongY} M 0 0H ${strongX}`;
      defs+=`<pattern id="${uid}T" x="${gridOriginX}" y="${gridOriginY}" width="${strongX}" height="${strongY}" patternUnits="userSpaceOnUse"><path d="${minorPath}" fill="none" stroke="${minor}" stroke-width=".35" stroke-opacity=".7"/><path d="${majorPath}" fill="none" stroke="${major}" stroke-width=".7" stroke-opacity=".8"/><path d="${strongPath}" fill="none" stroke="${ten}" stroke-width="1.05" stroke-opacity=".9"/></pattern>`;
      background+=`<rect x="${m.l}" y="${m.t}" width="${pw}" height="${ph}" fill="url(#${uid}T)"/>`;
    }
    let grid='';
    if(state.paper==='grid'){
      grid += xt.map(v=>`<line x1="${X(v)}" y1="${m.t}" x2="${X(v)}" y2="${m.t+ph}" stroke="${COLORS.grid}" stroke-width="1"/>`).join('');
      grid += yt.map(v=>`<line x1="${m.l}" y1="${Y(v)}" x2="${m.l+pw}" y2="${Y(v)}" stroke="${COLORS.grid}" stroke-width="1"/>`).join('');
    }
    const errorBars=rows.map(r=>{
      const x=X(r.x),y=Y(r.y), xl=X(r.x-r.dx),xr=X(r.x+r.dx),ytop=Y(r.y+r.dy),yb=Y(r.y-r.dy),cap=5;
      return `<g stroke="${COLORS.point}" stroke-width="1.4">${r.dx?`<path d="M ${xl} ${y}H ${xr}M ${xl} ${y-cap}v${cap*2}M ${xr} ${y-cap}v${cap*2}"/>`:''}${r.dy?`<path d="M ${x} ${ytop}V ${yb}M ${x-cap} ${ytop}h${cap*2}M ${x-cap} ${yb}h${cap*2}"/>`:''}</g>`;
    }).join('');
    const line=weightedLinear(rows,false), prop=weightedLinear(rows,true), quad=weightedQuadratic(rows);
    let curves='';
    if(state.fitLinear&&line) curves+=`<path d="M ${X(axes.x.min)} ${Y(line.k*axes.x.min+line.b)} L ${X(axes.x.max)} ${Y(line.k*axes.x.max+line.b)}" stroke="${COLORS.linear}" stroke-width="3" fill="none"/>`;
    if(state.fitProportional&&prop) curves+=`<path d="M ${X(axes.x.min)} ${Y(prop.k*axes.x.min)} L ${X(axes.x.max)} ${Y(prop.k*axes.x.max)}" stroke="${COLORS.proportional}" stroke-width="3" stroke-dasharray="10 7" fill="none"/>`;
    if(state.fitQuadratic&&quad){
      const samples=Array.from({length:121},(_,i)=>axes.x.min+(axes.x.max-axes.x.min)*i/120);
      curves+=`<path d="${samples.map((x,i)=>`${i?'L':'M'} ${X(x)} ${Y(quad.a*x*x+quad.b*x+quad.c)}`).join(' ')}" stroke="${COLORS.quadratic}" stroke-width="3" fill="none"/>`;
    }
    if(state.fitSmooth&&rows.length>1) curves+=`<path d="${smoothPath(rows,X,Y)}" stroke="${COLORS.smooth}" stroke-width="3" fill="none"/>`;
    if(state.fitHorizontal&&horizontal) curves+=`<path d="M ${m.l} ${Y(horizontal.value)} H ${m.l+pw}" stroke="${COLORS.horizontal}" stroke-width="3" stroke-dasharray="13 6" fill="none"/>`;
    if(state.fitVertical&&vertical) curves+=`<path d="M ${X(vertical.value)} ${m.t} V ${m.t+ph}" stroke="${COLORS.vertical}" stroke-width="3" stroke-dasharray="5 5" fill="none"/>`;
    const formulaLabel=(fit,color,ratio,offset,throughZero=false)=>{
      const formula=lineEquation(fit,throughZero), dataX=axes.x.min+(axes.x.max-axes.x.min)*ratio, lineY=fit.k*dataX+(throughZero?0:fit.b);
      const boxW=Math.min(255,Math.max(125,formula.length*7.4+24)), boxH=30;
      const boxX=Math.max(m.l+9,Math.min(m.l+pw-boxW-9,X(dataX)-boxW/2));
      const preferredY=Y(lineY)+offset;
      const boxY=Math.max(m.t+9,Math.min(m.t+ph-boxH-9,preferredY));
      return `<g><rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="7" fill="#fff" fill-opacity=".94" stroke="${color}" stroke-opacity=".32"/><text x="${boxX+boxW/2}" y="${boxY+20}" text-anchor="middle" fill="${color}" font-size="14" font-weight="700">${esc(formula)}</text></g>`;
    };
    let formulas='';
    if(state.fitLinear&&line) formulas+=formulaLabel(line,COLORS.linear,.67,-44,false);
    if(state.fitProportional&&prop) formulas+=formulaLabel(prop,COLORS.proportional,.34,18,true);
    if(state.fitQuadratic&&quad){
      const formula=quadraticEquation(quad), boxW=Math.min(330,Math.max(155,formula.length*7.1+24)), boxH=30;
      const boxX=Math.max(m.l+9,Math.min(m.l+pw-boxW-9,X(axes.x.min+(axes.x.max-axes.x.min)*.52)-boxW/2));
      const boxY=Math.max(m.t+9,Math.min(m.t+ph-boxH-9,m.t+ph*.12));
      formulas+=`<g><rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="7" fill="#fff" fill-opacity=".94" stroke="${COLORS.quadratic}" stroke-opacity=".32"/><text x="${boxX+boxW/2}" y="${boxY+20}" text-anchor="middle" fill="${COLORS.quadratic}" font-size="14" font-weight="700">${esc(formula)}</text></g>`;
    }
    const constantLabel=(formula,color,x,y)=>{const boxW=Math.max(82,formula.length*7.4+22),boxH=28,boxX=Math.max(m.l+8,Math.min(m.l+pw-boxW-8,x)),boxY=Math.max(m.t+8,Math.min(m.t+ph-boxH-8,y));return `<g><rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="7" fill="#fff" fill-opacity=".94" stroke="${color}" stroke-opacity=".35"/><text x="${boxX+boxW/2}" y="${boxY+19}" text-anchor="middle" fill="${color}" font-size="13" font-weight="700">${esc(formula)}</text></g>`;};
    if(state.fitHorizontal&&horizontal&&horizontal.value>=axes.y.min&&horizontal.value<=axes.y.max) formulas+=constantLabel(`y = ${fmt(horizontal.value,6)}`,COLORS.horizontal,m.l+pw*.76,Y(horizontal.value)-36);
    if(state.fitVertical&&vertical&&vertical.value>=axes.x.min&&vertical.value<=axes.x.max) formulas+=constantLabel(`x = ${fmt(vertical.value,6)}`,COLORS.vertical,X(vertical.value)+10,m.t+36);
    const points=rows.map(r=>`<circle cx="${X(r.x)}" cy="${Y(r.y)}" r="5.5" fill="#fff" stroke="${COLORS.point}" stroke-width="3"/>`).join('');
    const tickLabels=xt.map(v=>`<path d="M ${X(v)} ${m.t+ph}v8" stroke="#17201c" stroke-width="1.4"/><text x="${X(v)}" y="${m.t+ph+29}" text-anchor="middle" font-size="15">${fmt(v,6)}</text>`).join('')+
      yt.map(v=>`<path d="M ${m.l-8} ${Y(v)}h8" stroke="#17201c" stroke-width="1.4"/><text x="${m.l-14}" y="${Y(v)+5}" text-anchor="end" font-size="15">${fmt(v,6)}</text>`).join('');
    const legends=[];
    if(state.fitLinear&&line) legends.push([COLORS.linear,t('linearFit'),'']);
    if(state.fitProportional&&prop) legends.push([COLORS.proportional,t('proportionalFit'),'10 7']);
    if(state.fitQuadratic&&quad) legends.push([COLORS.quadratic,t('quadraticFit'),'']);
    if(state.fitSmooth&&rows.length>1) legends.push([COLORS.smooth,t('smooth'),'']);
    if(state.fitHorizontal&&horizontal) legends.push([COLORS.horizontal,`${t('horizontalFit')}: y = ${fmt(horizontal.value,6)}`,'13 6']);
    if(state.fitVertical&&vertical) legends.push([COLORS.vertical,`${t('verticalFit')}: x = ${fmt(vertical.value,6)}`,'5 5']);
    let legend='';
    if(legends.length&&state.showLegend){ const cols=portrait?1:Math.min(3,legends.length), itemW=pw/cols, ly=portrait?21*mm:20*mm;
      legend=`<g>${legends.map((l,i)=>{const col=i%cols,row=Math.floor(i/cols),lx=m.l+col*itemW;return `<line x1="${lx}" y1="${ly+row*22}" x2="${lx+31}" y2="${ly+row*22}" stroke="${l[0]}" stroke-width="3" ${l[2]?`stroke-dasharray="${l[2]}"`:''}/><text x="${lx+40}" y="${ly+row*22+4}" font-size="12">${esc(l[1])}</text>`}).join('')}</g>`;
    }
    const title=esc(state.chartTitle||t('chartFallback'));
    const calibration=state.paper==='millimeter'?`<g fill="#66766b" stroke="#66766b"><path d="M ${width-24*mm} ${height-8*mm}v${2*mm}M ${width-24*mm} ${height-7*mm}h${10*mm}M ${width-14*mm} ${height-8*mm}v${2*mm}" stroke-width=".75"/><text x="${width-19*mm}" y="${height-9*mm}" text-anchor="middle" stroke="none" font-size="8">${esc(t('calibration'))}</text></g>`:'';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${pageMmW}mm" height="${pageMmH}mm" style="font-family:${font};color:#17201c" role="img" aria-labelledby="${uid}t ${uid}d"><title id="${uid}t">${title}</title><desc id="${uid}d">${esc(t('chartDescription',{count:rows.length}))}</desc><defs>${defs}</defs>${background}<text x="${width/2}" y="${8.5*mm}" text-anchor="middle" font-family="Georgia,serif" font-size="24" font-weight="600">${title}</text>${grid}<g clip-path="url(#${uid})">${curves}${errorBars}</g><rect x="${m.l}" y="${m.t}" width="${pw}" height="${ph}" fill="none" stroke="#17201c" stroke-width="1.8"/>${points}${formulas}${tickLabels}<text x="${m.l+pw/2}" y="${m.t+ph+13*mm}" text-anchor="middle" font-size="18" font-weight="600">${esc(axisName(state.xLabel,state.xUnit))}</text><text transform="translate(${4*mm} ${m.t+ph/2}) rotate(-90)" text-anchor="middle" font-size="18" font-weight="600">${esc(axisName(state.yLabel,state.yUnit))}</text>${legend}${calibration}</svg>`;
  }

  function update() {
    state.chartTitle=$('chartTitle').value; state.xLabel=$('xLabel').value; state.xUnit=$('xUnit').value; state.yLabel=$('yLabel').value; state.yUnit=$('yUnit').value;
    state.paper=$('paper').value; state.orientation=$('orientation').value; state.gridIntensity=$('gridIntensity').value;
    ['fitLinear','fitProportional','fitQuadratic','fitSmooth','fitHorizontal','fitVertical','showLegend','autoScale'].forEach(id=>state[id]=$(id).checked);
    ['xMin','xMax','xStep','yMin','yMax','yStep'].forEach(id=>state[id]=$(id).value);
    $('axisFields').classList.toggle('disabled', state.autoScale);
    $('millimeterOptions').hidden=state.paper!=='millimeter';
    $('paperSheet').className=`paper-sheet ${state.orientation}`;
    $('chart').innerHTML=buildSvg();
    renderDataSummary();renderResults();scheduleSave();
  }

  function renderDataSummary(){
    const rows=validRows();
    if(!rows.length){$('dataSummary').textContent=t('noValidPoints');return;}
    $('dataSummary').textContent=t('dataSummary',{
      count:rows.length,
      xmin:fmt(Math.min(...rows.map(row=>row.x)),6),xmax:fmt(Math.max(...rows.map(row=>row.x)),6),
      ymin:fmt(Math.min(...rows.map(row=>row.y)),6),ymax:fmt(Math.max(...rows.map(row=>row.y)),6)
    });
  }

  function renderResults() {
    const rows=validRows(), line=weightedLinear(rows,false), prop=weightedLinear(rows,true), quad=weightedQuadratic(rows), horizontal=constantValue(rows,'y'), vertical=constantValue(rows,'x'), cards=[];
    if(state.fitLinear&&line) cards.push([t('linearFit'),`k = ${fmt(line.k)} ± ${fmt(line.sk)}; b = ${fmt(line.b)} ± ${fmt(line.sb)}; R² = ${fmt(rSquared(rows,x=>line.k*x+line.b),5)}`,COLORS.linear]);
    if(state.fitProportional&&prop) cards.push([t('proportionalFit'),`k = ${fmt(prop.k)} ± ${fmt(prop.sk)}; R² = ${fmt(rSquared(rows,x=>prop.k*x),5)}`,COLORS.proportional]);
    if(state.fitQuadratic&&quad) cards.push([t('quadraticFit'),`${quadraticEquation(quad)}; R² = ${fmt(rSquared(rows,x=>quad.a*x*x+quad.b*x+quad.c),5)}`,COLORS.quadratic]);
    if(state.fitSmooth&&rows.length>1) cards.push([t('interpolation'),`${rows.length} ${t('experimentalPoints')}`,COLORS.smooth]);
    if(state.fitHorizontal&&horizontal) cards.push([t('horizontalFit'),`y = ${fmt(horizontal.value,6)}${horizontal.automatic?` (${t('calculated')})`:''}`,COLORS.horizontal]);
    if(state.fitVertical&&vertical) cards.push([t('verticalFit'),`x = ${fmt(vertical.value,6)}${vertical.automatic?` (${t('calculated')})`:''}`,COLORS.vertical]);
    $('results').innerHTML=cards.length?cards.map(c=>`<div class="result-card" style="--result-color:${c[2]}"><span class="result-kind">${esc(c[0])}</span><strong class="result-formula">${esc(c[1])}</strong><button type="button" data-copy="${esc(c[1])}">${esc(t('copy'))}</button></div>`).join(''):`<p class="results-empty">${esc(t('resultsEmpty'))}</p>`;
  }
  function persistState(){
    try{localStorage.setItem('labgraph-state',JSON.stringify(state));return true;}
    catch(_){toast(t('storageFailed'));return false;}
  }
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer=setTimeout(persistState,350);
  }
  function toast(message) { const t=$('toast'); t.textContent=message; t.classList.add('show'); clearTimeout(t._timer); t._timer=setTimeout(()=>t.classList.remove('show'),2200); }

  function parsePaste(text) {
    return text.trim().split(/\r?\n/).map(line=>line.trim().split(/[\t;]+|\s{2,}/).filter(Boolean)).map(cols=>{
      if(cols.length>=4) return {x:cols[0],dx:cols[1],y:cols[2],dy:cols[3]};
      if(cols.length>=2) return {x:cols[0],dx:'',y:cols[1],dy:''};
      return null;
    }).filter(r=>r&&num(r.x)!==null&&num(r.y)!==null);
  }
  function parseDelimited(text){
    const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(line=>line.trim());
    if(!lines.length)return [];
    const sample=lines[0], delimiter=sample.includes('\t')?'\t':sample.includes(';')?';':sample.includes(',')?',':null;
    const split=line=>delimiter?line.split(delimiter).map(v=>v.trim().replace(/^"|"$/g,'')):line.trim().split(/\s+/);
    return lines.map(split).map(cols=>{
      if(cols.length>=4)return {x:cols[0],dx:cols[1],y:cols[2],dy:cols[3]};
      if(cols.length>=2)return {x:cols[0],dx:'',y:cols[1],dy:''};
      return null;
    }).filter(r=>r&&num(r.x)!==null&&num(r.y)!==null);
  }
  function openTextFile(input,handler){
    const file=input.files&&input.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>handler(String(reader.result||''),file.name);
    reader.onerror=()=>toast(t('fileReadFailed'));
    reader.readAsText(file,'UTF-8');
  }
  function download(blob,name){
    if(!(blob instanceof Blob)||!blob.size)throw new Error('empty file');
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    try{a.href=url;a.download=name;document.body.append(a);a.click();}
    finally{a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
  }
  function safeName(ext){
    let base=String(state.chartTitle||'').normalize('NFKC').replace(/[<>:"/\\|?*\u0000-\u001f]/g,' ').replace(/[^\p{L}\p{N}._ -]+/gu,' ').replace(/[ ._-]+/g,'-').replace(/^[.-]+|[.-]+$/g,'').slice(0,80);
    if(!base)base='labgraph';
    if(/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(base))base='labgraph-'+base;
    return `${base}.${ext}`;
  }
  function exportProject(){
    try{
      const project={format:'labgraph-project',version:2,savedAt:new Date().toISOString(),language,state:cloneState()};
      download(new Blob([JSON.stringify(project,null,2)],{type:'application/json;charset=utf-8'}),safeName('labgraph.json'));
      toast(t('projectSaved'));
    }catch(_){toast(t('downloadFailed'));}
  }
  function exportCsv(){
    try{
      const delimiter=language==='ru'?';':',';
      const quote=value=>{const s=String(value??'');return /["\r\n,;]/.test(s)?`"${s.replaceAll('"','""')}"`:s;};
      const lines=[['X','dX','Y','dY'],...state.rows.map(r=>[r.x,r.dx,r.y,r.dy])].map(row=>row.map(quote).join(delimiter));
      download(new Blob(['\uFEFF'+lines.join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'}),safeName('csv'));
      toast(t('csvDownloaded'));
    }catch(_){toast(t('downloadFailed'));}
  }
  function exportSvg(){
    try{const svg='<?xml version="1.0" encoding="UTF-8"?>\n'+buildSvg();download(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}),safeName('svg'));toast(t('svgDownloaded'));}
    catch(_){toast(t('downloadFailed'));}
  }
  async function exportPng(){
    const portrait=state.orientation==='portrait', w=portrait?2480:3508, h=portrait?3508:2480, svg=buildSvg(), img=new Image(), url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
    try{
      await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
      const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');
      if(!ctx)throw new Error('canvas');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
      const blob=await new Promise((resolve,reject)=>c.toBlob(value=>value?resolve(value):reject(new Error('png')),'image/png'));
      download(blob,safeName('png'));toast(t('pngDownloaded'));
    }catch(_){toast(t('downloadFailed'));}
    finally{URL.revokeObjectURL(url);}
  }
  function pdfFromJpeg(jpeg,width,height){
    const portrait=height>width, encode=s=>new TextEncoder().encode(s), pageW=portrait?'595.2756':'841.8898', pageH=portrait?'841.8898':'595.2756';
    const content=encode(`q ${pageW} 0 0 ${pageH} 0 0 cm /Im0 Do Q\n`);
    const objects=[
      [encode('<< /Type /Catalog /Pages 2 0 R >>')],
      [encode('<< /Type /Pages /Kids [3 0 R] /Count 1 >>')],
      [encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`)],
      [encode(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),jpeg,encode('\nendstream')],
      [encode(`<< /Length ${content.length} >>\nstream\n`),content,encode('endstream')]
    ];
    const header=new Uint8Array([37,80,68,70,45,49,46,52,10,37,255,255,255,255,10]), chunks=[header], offsets=[0];
    let total=header.length;
    const push=bytes=>{chunks.push(bytes);total+=bytes.length;};
    objects.forEach((parts,i)=>{offsets[i+1]=total;push(encode(`${i+1} 0 obj\n`));parts.forEach(push);push(encode('\nendobj\n'));});
    const xref=total;
    let table=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
    for(let i=1;i<=objects.length;i++) table+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
    table+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    push(encode(table));
    return new Blob(chunks,{type:'application/pdf'});
  }
  async function exportPdf(){
    toast(t('pdfPreparing'));
    const portrait=state.orientation==='portrait',w=portrait?2480:3508,h=portrait?3508:2480,svg=buildSvg(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    try{
      const img=new Image();
      await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
      const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('canvas');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
      const jpegBlob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('jpeg')),'image/jpeg',.98));
      const jpeg=new Uint8Array(await jpegBlob.arrayBuffer());
      download(pdfFromJpeg(jpeg,w,h),safeName('pdf'));toast(t('pdfDownloaded'));
    }catch(_){toast(t('pdfFailed'));}
    finally{URL.revokeObjectURL(url);}
  }
  function printA4(){ const style=document.createElement('style');style.id='dynamicPage';style.textContent=`@page { size: A4 ${state.orientation}; margin: 0; }`;document.head.append(style);setTimeout(()=>{window.print();style.remove();},80); }

  $('dataBody').addEventListener('focusin',e=>{if(e.target.matches('input'))editSnapshot=cloneState();});
  $('dataBody').addEventListener('change',e=>{if(e.target.matches('input')&&editSnapshot){checkpoint(editSnapshot);editSnapshot=null;}});
  $('dataBody').addEventListener('input',e=>{ if(!e.target.matches('input'))return; const tr=e.target.closest('tr');state.rows[+tr.dataset.row][e.target.dataset.key]=e.target.value;update(); });
  $('dataBody').addEventListener('keydown',e=>{ if(e.key!=='Enter'||!e.target.matches('input'))return;e.preventDefault();const inputs=[...$('dataBody').querySelectorAll('input')],i=inputs.indexOf(e.target);if(i===inputs.length-1){$('addRowBtn').click();}else inputs[i+1].focus(); });
  $('dataBody').addEventListener('click',e=>{ if(!e.target.closest('.delete-row'))return;checkpoint();const i=+e.target.closest('tr').dataset.row;if(state.rows.length===1)state.rows=[{x:'',dx:'',y:'',dy:''}];else state.rows.splice(i,1);renderRows();update(); });
  document.querySelectorAll('.controls input:not(.data-table input), .controls select').forEach(el=>{
    el.addEventListener('focus',()=>{editSnapshot=cloneState();});
    el.addEventListener('change',()=>{if(editSnapshot){checkpoint(editSnapshot);editSnapshot=null;}});
    el.addEventListener('input',update);
  });
  $('addRowBtn').addEventListener('click',()=>{ checkpoint();state.rows.push({x:'',dx:'',y:'',dy:''});renderRows();update();$('dataBody').lastElementChild.querySelector('input').focus(); });
  $('applyCommonErrors').addEventListener('click',()=>{
    const rawDx=$('commonDx').value.trim(), rawDy=$('commonDy').value.trim();
    const dx=rawDx===''?null:num(rawDx), dy=rawDy===''?null:num(rawDy);
    if(dx===null&&dy===null){toast(t('enterUncertainty'));return;}
    if((rawDx!==''&&dx===null)||(rawDy!==''&&dy===null)||dx<0||dy<0){toast(t('invalidUncertainty'));return;}
    checkpoint();state.rows.forEach(row=>{if(dx!==null)row.dx=rawDx.replace(',','.');if(dy!==null)row.dy=rawDy.replace(',','.');});
    renderRows();update();toast(t('errorsApplied'));
  });
  $('clearRowsBtn').addEventListener('click',()=>{ checkpoint();state.rows=[{x:'',dx:'',y:'',dy:''}];renderRows();update();$('dataBody').querySelector('input').focus();toast(t('tableCleared')); });
  $('loadDemoBtn').addEventListener('click',()=>{ checkpoint();state.rows=JSON.parse(JSON.stringify(demoRows));renderRows();update();toast(t('demoLoaded')); });
  $('resetBtn').addEventListener('click',()=>{ if(!confirm(t('resetConfirm')))return;checkpoint();state={...cloneDefaults(),...META[language]};syncControls();toast(t('newGraphCreated')); });
  $('pasteBtn').addEventListener('click',()=>{ $('pasteArea').value='';$('pasteDialog').showModal();setTimeout(()=>$('pasteArea').focus(),50); });
  $('pasteClipboardBtn').addEventListener('click',async()=>{
    try{
      const text=await navigator.clipboard.readText();
      if(!text.trim())throw new Error('empty');
      $('pasteArea').value=text;toast(t('clipboardLoaded'));
    }catch(_){toast(t('clipboardFailed'));$('pasteArea').focus();}
  });
  $('applyPasteBtn').addEventListener('click',e=>{ const parsed=parsePaste($('pasteArea').value);if(!parsed.length){e.preventDefault();toast(t('pasteFailed'));return;}checkpoint();state.rows=parsed;renderRows();update();toast(t('rowsLoaded',{count:parsed.length})); });
  $('importDataBtn').addEventListener('click',()=>$('dataFileInput').click());
  $('dataFileInput').addEventListener('change',()=>openTextFile($('dataFileInput'),text=>{
    const parsed=parseDelimited(text);
    if(!parsed.length){toast(t('noNumericData'));return;}
    checkpoint();state.rows=parsed;renderRows();update();toast(t('pointsImported',{count:parsed.length}));$('dataFileInput').value='';
  }));
  const dataSection=$('dataSection');
  ['dragenter','dragover'].forEach(name=>dataSection.addEventListener(name,event=>{event.preventDefault();dataSection.classList.add('drag-active');}));
  ['dragleave','drop'].forEach(name=>dataSection.addEventListener(name,event=>{event.preventDefault();dataSection.classList.remove('drag-active');}));
  dataSection.addEventListener('drop',async event=>{
    try{
      const file=event.dataTransfer.files&&event.dataTransfer.files[0];
      const text=file?await file.text():event.dataTransfer.getData('text/plain');
      const parsed=file?parseDelimited(text):parsePaste(text);
      if(!parsed.length){toast(t('noNumericData'));return;}
      checkpoint();state.rows=parsed;renderRows();update();toast(t('fileDropped',{count:parsed.length}));
    }catch(_){toast(t('fileReadFailed'));}
  });
  $('sortRowsBtn').addEventListener('click',()=>{checkpoint();state.rows.sort((a,b)=>(num(a.x)??Infinity)-(num(b.x)??Infinity));renderRows();update();toast(t('sorted'));});
  $('autoTitleBtn').addEventListener('click',()=>{
    const x=$('xLabel').value.trim()||'X',y=$('yLabel').value.trim()||'Y';
    checkpoint();$('chartTitle').value=language==='ru'?`${y} — ${x}`:`${y} vs ${x}`;update();toast(t('autoTitleMade'));
  });
  $('swapAxesBtn').addEventListener('click',()=>{
    checkpoint();
    const titles={
      'Зависимость силы тока от напряжения':'Зависимость напряжения от силы тока',
      'Зависимость напряжения от силы тока':'Зависимость силы тока от напряжения',
      'Current versus voltage':'Voltage versus current',
      'Voltage versus current':'Current versus voltage'
    };
    state.rows=state.rows.map(row=>({x:row.y,dx:row.dy,y:row.x,dy:row.dx}));
    [state.xLabel,state.yLabel]=[state.yLabel,state.xLabel];
    [state.xUnit,state.yUnit]=[state.yUnit,state.xUnit];
    [state.xMin,state.yMin]=[state.yMin,state.xMin];
    [state.xMax,state.yMax]=[state.yMax,state.xMax];
    [state.xStep,state.yStep]=[state.yStep,state.xStep];
    [state.fitHorizontal,state.fitVertical]=[state.fitVertical,state.fitHorizontal];
    state.chartTitle=titles[state.chartTitle]||state.chartTitle;
    syncControls();toast(t('axesSwapped'));
  });
  $('undoBtn').addEventListener('click',()=>restoreHistory(undoStack,redoStack,t('actionUndone')));
  $('redoBtn').addEventListener('click',()=>restoreHistory(redoStack,undoStack,t('actionRedone')));
  $('saveProjectBtn').addEventListener('click',exportProject);
  $('openProjectBtn').addEventListener('click',()=>$('projectFileInput').click());
  $('projectFileInput').addEventListener('change',()=>openTextFile($('projectFileInput'),text=>{
    try{
      const project=JSON.parse(text), loaded=project&&project.format==='labgraph-project'?project.state:project;
      if(!loaded||typeof loaded!=='object'||!Array.isArray(loaded.rows)||loaded.rows.length>10000)throw new Error('format');
      const rows=loaded.rows.map(row=>{
        if(!row||typeof row!=='object')throw new Error('row');
        const value=key=>(typeof row[key]==='string'||typeof row[key]==='number')?String(row[key]):'';
        return {x:value('x'),dx:value('dx'),y:value('y'),dy:value('dy')};
      });
      const clean=cloneDefaults();
      ['chartTitle','xLabel','xUnit','yLabel','yUnit','xMin','xMax','xStep','yMin','yMax','yStep'].forEach(key=>{
        if(typeof loaded[key]==='string'||typeof loaded[key]==='number')clean[key]=String(loaded[key]);
      });
      ['fitLinear','fitProportional','fitQuadratic','fitSmooth','fitHorizontal','fitVertical','showLegend','autoScale'].forEach(key=>{if(typeof loaded[key]==='boolean')clean[key]=loaded[key];});
      if(['plain','grid','millimeter'].includes(loaded.paper))clean.paper=loaded.paper;
      if(['landscape','portrait'].includes(loaded.orientation))clean.orientation=loaded.orientation;
      if(['1','2','3'].includes(String(loaded.gridIntensity)))clean.gridIntensity=String(loaded.gridIntensity);
      clean.rows=rows.length?rows:[{x:'',dx:'',y:'',dy:''}];
      checkpoint();state=clean;
      if(project&&project.format==='labgraph-project'&&(project.language==='ru'||project.language==='en')){language=project.language;localStorage.setItem('labgraph-language',language);applyLanguage();}
      syncControls();toast(t('projectOpened'));
    }catch(_){toast(t('invalidProject'));}
    $('projectFileInput').value='';
  }));
  $('zoomOut').addEventListener('click',()=>setZoom(zoom-.1)); $('zoomIn').addEventListener('click',()=>setZoom(zoom+.1));
  function setZoom(v){
    zoom=Math.max(.6,Math.min(1.4,Math.round(v*10)/10));
    const sheet=$('paperSheet'), stage=$('canvasStage');
    sheet.style.transform=`scale(${zoom})`;
    stage.style.paddingBottom=`${23+Math.max(0,(zoom-1)*sheet.offsetHeight)}px`;
    // Scaling from the left edge keeps Y-axis values reachable instead of
    // pushing them into an invisible negative-overflow area.
    if(zoom>1) stage.scrollLeft=0;
    $('zoomValue').textContent=Math.round(zoom*100)+'%';
  }
  $('printBtn').addEventListener('click',exportPdf);
  $('helpBtn').addEventListener('click',()=>$('helpDialog').showModal());
  $('viewPreviewBtn').addEventListener('click',()=>$('previewArea').scrollIntoView({behavior:'smooth',block:'start'}));
  document.querySelectorAll('[data-export]').forEach(b=>b.addEventListener('click',()=>({svg:exportSvg,png:exportPng,pdf:exportPdf,csv:exportCsv}[b.dataset.export]())));
  $('results').addEventListener('click',async e=>{const b=e.target.closest('[data-copy]');if(!b)return;try{await navigator.clipboard.writeText(b.dataset.copy);toast(t('copied'));}catch(_){toast(t('copyFailed'));}});
  $('themeBtn').addEventListener('click',switchTheme);
  $('langBtn').addEventListener('click',switchLanguage);
  window.addEventListener('keydown',e=>{
    if(!(e.ctrlKey||e.metaKey))return;
    const key=e.key.toLowerCase();
    if(key==='p'){e.preventDefault();exportPdf();}
    if(key==='z'){e.preventDefault();restoreHistory(e.shiftKey?redoStack:undoStack,e.shiftKey?undoStack:redoStack,t(e.shiftKey?'actionRedone':'actionUndone'));}
    if(key==='y'){e.preventDefault();restoreHistory(redoStack,undoStack,t('actionRedone'));}
    if(key==='s'){e.preventDefault();exportProject();}
    if(key==='o'){e.preventDefault();$('projectFileInput').click();}
  });
  window.addEventListener('pagehide',persistState);
  async function detectLauncher(){
    if(location.protocol==='file:')return;
    try{
      const response=await fetch('/__labgraph/status',{cache:'no-store'});
      const info=await response.json();
      if(info.app==='LabGraph'&&info.shutdown&&info.token){
        const button=$('shutdownBtn');button.hidden=false;
        const heartbeat=setInterval(()=>fetch('/__labgraph/status',{cache:'no-store'}).catch(()=>clearInterval(heartbeat)),30000);
        button.addEventListener('click',async()=>{
          if(!confirm(t('shutdownConfirm')))return;
          clearInterval(heartbeat);
          try{await fetch('/__labgraph/shutdown',{method:'POST',headers:{'X-LabGraph-Token':info.token}});}catch(_){}
          document.body.innerHTML=`<main class="stopped-screen"><div><span class="brand-mark"><i></i><i></i><i></i></span><h1>${esc(t('stoppedTitle'))}</h1><p>${esc(t('stoppedText'))}</p></div></main>`;
        });
      }
    }catch(_){}
  }
  function setupStepNavigation(){
    const controls=document.querySelector('.controls'),links=[...document.querySelectorAll('.steps a')],sections=links.map(link=>document.querySelector(link.getAttribute('href')));
    const highlight=()=>{
      const marker=controls.scrollTop+95;
      let active=0;
      sections.forEach((section,index)=>{if(section.offsetTop<=marker)active=index;});
      links.forEach((link,index)=>link.classList.toggle('active',index===active));
    };
    links.forEach((link,index)=>link.addEventListener('click',event=>{event.preventDefault();sections[index].scrollIntoView({behavior:'smooth',block:'start'});links.forEach((item,i)=>item.classList.toggle('active',i===index));}));
    controls.addEventListener('scroll',highlight,{passive:true});
    highlight();
  }
  applyTheme();applyLanguage();syncControls();updateHistoryButtons();setupStepNavigation();detectLauncher();
})();
