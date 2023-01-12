// Подготовка данных для сборочной спецификации и сохранения

var storeBeads = []                                     // Массив для хранения и выгрузки
var specBeads = [{diam : 0, colorindex : 0, sum: 0}]    // Массив для спецификации

// Функция возвращает массив с необходимой информацией для сборки или отрисовки
function prepareBeads() {
  var resultBeads = []
  beads.forEach(function(bead) {
    resultBeads.push({diam : bead.attr('r')*2, colorindex: bead.data('colorindex'), index: bead.data('index')})
  })
  return resultBeads
}

// Функция сортирует массив для сборки
function sortBeads (beadsArray) {
  var sorto = {
    colorindex:"asc", diam:"asc"
  };
  mksort.sort(beadsArray, sorto);
}

// Функция заполняет массив для спецификации и добавляет в массив для хранения поле с "номером коробки"
function specifyBeads () {
  storeBeads = prepareBeads()
  specBeads = [{diam : 0, colorindex : 0, sum: 0}]
  var sortedBd = prepareBeads()
  var boxIndex = 0
  sortBeads(sortedBd)
  for (var i =0; i < sortedBd.length; i++) {
    if (i > 0) {
      if (sortedBd[i].diam != sortedBd[i-1].diam || sortedBd[i].colorindex != sortedBd[i-1].colorindex) {
        boxIndex++
        specBeads.push({diam : 0, colorindex : 0, sum: 0})
      } 
    }
    storeBeads[sortedBd[i].index].Nbox = boxIndex
    specBeads[boxIndex].colorindex = sortedBd[i].colorindex
    specBeads[boxIndex].diam = sortedBd[i].diam
    specBeads[boxIndex].sum += 1
  }
}

// Функция заолняет модальное окно со спецификацией
function renderSpec () {
  specifyBeads ()
  let bead_spec = document.querySelector("#specification")
  bead_spec.innerHTML = ""
  specBeads.forEach(function(bead, index) {
    let row = document.createElement('div')
    row.className = "row"
    bead_spec.appendChild(row)
    let col_diam = document.createElement('div')
    col_diam.className = "col-md-4 shrink33"
    col_diam.innerHTML = '<span>'+ bead.diam +'</span>'
    let col_color = document.createElement('div')
    col_color.className = "col-md-4 shrink33"
    col_color.id = "colicon" + index
    col_color.innerHTML = '<span>'+ bead.colorindex +'</span>'
    let col_number = document.createElement('div')
    col_number.className = "col-md-4 shrink33"
    col_number.innerHTML = '<span>'+ bead.sum +'</span>'
    row.appendChild(col_diam)
    row.appendChild(col_color)
    row.appendChild(col_number)
    drawSpecSwatch (bead.colorindex, index)
  })
  function drawSpecSwatch (color, nbox) {
    let svginst = SVG().addTo('#colicon' + nbox).size('50px','50px').viewbox(0, 0, 20, 20)
    let swatch = svginst.circle(18)
    swatch.center(10,10)
    swatch.fill(palettePickerGrads[color])
  }
  saveSpecToSvg ()
}

// Функция рисует спецификацию целиком в svg для сохранения и отправки
function renderSpecSvg () {
  var specExp = SVG().addTo('#specExport').size('210mm','297mm').viewbox(0, 0, 210, 297)
  specExp.circle(105) // тут будет формирование спец-ии

}

// Функция сохраняет спецификацию из модального окна в pdf
function saveSpecToSvg () {
  renderSpecSvg ()
  modal_doc = document.querySelector('#specExport > svg')
  document.querySelector('#nablob').setAttribute('href',bloberize(modal_doc))
}

// Экспериментальная функция - из любого нода блоб
function bloberize (object) {
  let blob = new Blob([object.outerHTML], {type: 'text/html'});
  return URL.createObjectURL(blob)
}