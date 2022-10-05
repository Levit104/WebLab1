let form = document.querySelector('#form_with_validation');

let rValue = ''; // переменная для хранения значения выбранной кнопки

// проверка является ли строка числом
function isNumeric(string) {
    let number = parseFloat(string);
    return !isNaN(number) && isFinite(number);
}

// создание блока с ошибкой (цвета, рамки и т.д. в CSS)
function createError(message) {
    let error = document.createElement('div');
    error.className = 'error';
    error.innerHTML = message;
    return error;
}

// очистка ошибок (чтобы не появлялось несколько надписей подряд)
function removeErrors() {
    form.querySelectorAll('.error').forEach(error => {
        error.remove();
    });
}

// проверка чекбоксов
function checkX() {
    let xFirstElement = form.querySelector('.x_value'); // querySelector выбирает только первый элемент
    let numberOfChecked = form.querySelectorAll('.x_value:checked').length;

    if (numberOfChecked === 0) {
        xFirstElement.parentElement.insertBefore(createError('Значение не выбрано'), xFirstElement);
        return false;
    }

    return true;
}

// проверка текстового поля
function checkY() {
    let yElement = form.querySelector('.y_value');
    let yValue = yElement.value;

    const MIN = -3;
    const MAX = 3;

    if (!yValue) {
        yElement.parentElement.insertBefore(createError('Пустое поле'), yElement);
        return false;
    } else if (!isNumeric(yValue) || yValue <= MIN || yValue >= MAX) {
        yElement.parentElement.insertBefore(createError('Недопустимое значение'), yElement);
        return false;
    } else if (yValue.length > 1 && yValue.slice(-1) === '0') {
        yElement.parentElement.insertBefore(createError('Лишние нули'), yElement);
        return false;
    } else if (yValue.slice(-1) === '.' || yValue.slice(-1) === ',' || /[,]{2,}/.test(yValue) || /[.]{2,}/.test(yValue)) {
        yElement.parentElement.insertBefore(createError('Лишний разделитель'), yElement);
        return false;
    } else if (yValue.search(',') != -1) {
        yElement.parentElement.insertBefore(createError('Разделитель - точка'), yElement);
        return false;
    }

    return true;
}

// проверка кнопок
function checkR() {
    let rFirstElement = form.querySelector('.r_value'); // querySelector выбирает только первый элемент

    if (!rValue) {
        rFirstElement.parentElement.insertBefore(createError('Значение не выбрано'), rFirstElement);
        return false;
    }

    return true;
}

// все проверки вместе
function checkAll() {
    return checkX() & checkY() & checkR();
}

// отображение значения выбранной кнопки
function displayR() {
    form.querySelector('#current_value').innerHTML = rValue;
}

// очистка переменной rValue, где хранится значение кнопки
function clearR() {
    rValue = '';
}

// присвоение значения выбранной кнопки переменной rValue (см. атрибут onclick у r_value)
function setR(element) {
    rValue = element.value;
    displayR();
}

// выбор только одного чекбокса, а не нескольких (см. атрибут onclick у x_value)
function setX(element) {
    form.querySelectorAll('.x_value').forEach(xValue => {
        xValue.checked = false;
    });

    element.checked = true;

    // JQuery версия
    // $('.x_value').click(function () {
    //     $('.x_value').not(this).prop('checked', false)
    // });
}

// очистка полей при нажатии кнопки "Сбросить"
form.addEventListener('reset', function () {
    removeErrors();
    clearR();
    displayR();
});

// отправка данных PHP-скрипту при нажатии кнопки "Подтвердить"
form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Данные для проверки получены');
    removeErrors();

    if (!checkAll()) {
        console.log('Отмена запроса');
        return;
    }

    $.ajax({
        url: 'php/fill_table.php',
        method: 'POST',
        data: $(this).serialize() + '&timezone=' + new Date().getTimezoneOffset() + '&r_value=' + rValue,
        dataType: 'html',
        success: function (data) {
            console.log('Данные успешно отправлены');
            $('#result_table>tbody').html(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
});

// заполнение таблицы при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: 'php/load_table.php',
        method: 'POST',
        dataType: 'html',
        success: function (data) {
            console.log('Данные успешно загружены');
            $('#result_table>tbody').html(data);
        },
        error: function (error) {
            console.log(error);
        }
    })
});

// очистка таблицы при нажатии соответствующей кнопки
document.querySelector('#clear_button').addEventListener('click', function () {
    $.ajax({
        url: 'php/clear_table.php',
        method: 'POST',
        dataType: 'html',
        success: function (data) {
            console.log('Таблица успешно очищена');
            $("#result_table>tbody").html(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
});