'use strict';

let elementsX = document.querySelectorAll('.x_value');
let elementY = document.querySelector('#y_value');
let elementsR = document.querySelectorAll('.r_value');

let form = document.querySelector('#form');
let clearButton = document.querySelector('#clear_button');
let buttonValueContainer = document.querySelector('#current_value');
// Переменная для хранения значения выбранной кнопки
let currentButtonValue = '';

// Заполнение таблицы при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: 'php/load_table.php',
        method: 'POST',
        dataType: 'html',
        success: function (data) {
            $("#results_container>tbody").html(data);
        },
        error: function (error) {
            console.log(error);
        }
    })
});

// Отправка данных при нажатии кнопки "Подтвердить"
form.addEventListener('submit', function (event) {
    event.preventDefault();
    removeErrors();

    let allValid = validateCheckboxes(elementsX) &
        validTextField(elementY, -3, 3) &
        validateButtons(elementsR, currentButtonValue);

    if (!allValid) return;

    $.ajax({
        url: 'php/fill_table.php',
        method: 'POST',
        data: $(this).serialize() + '&r=' + currentButtonValue + '&timezone=' + new Date().getTimezoneOffset(),
        dataType: 'html',
        success: function (data) {
            $("#results_container>tbody").html(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
});

// Очистка полей при нажатии кнопки "Сбросить"
form.addEventListener('reset', function () {
    removeErrors();
    resetButtonValue();
    displayButtonValue();
});

// Очистка таблицы при нажатии соответствующей кнопки
clearButton.addEventListener('click', function () {
    $.ajax({
        url: 'php/clear_table.php',
        method: 'POST',
        dataType: 'html',
        success: function (data) {
            $("#results_container>tbody").html(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
});

// Присвоение значения выбранной кнопки переменной
elementsR.forEach(element => {
    element.addEventListener('click', function () {
        currentButtonValue = element.value;
        displayButtonValue();
    });
})
// через атрибут onclick="setButtonValue(this)" у r_value
// function setButtonValue(element) {
//     currentButtonValue = element.value;
//     displayButtonValue();
// }


// ДОП ЗАДАНИЕ
// Выбор только одного чекбокса, а не нескольких
// Ванильный JS
elementsX.forEach(element => {
    element.addEventListener('click', function () {
        elementsX.forEach(elementToUncheck => {
            elementToUncheck.checked = false;
        });
        element.checked = true;
    });
});
// Через атрибут onclick="checkOnlyOneCheckbox(this)" у x_value
// function checkOnlyOneCheckbox(element) {
//     form.querySelectorAll('.x_value').forEach(xValue => {
//         xValue.checked = false;
//     });
//
//     element.checked = true;
// }
// JQuery версия
// $('.x_value').click(function () {
//     $('.x_value').not(this).prop('checked', false)
// });


// Отображение значения выбранной кнопки
function displayButtonValue() {
    buttonValueContainer.innerHTML = currentButtonValue;
}

// Сброс текущего значения кнопки (переменной)
function resetButtonValue() {
    currentButtonValue = '';
}
