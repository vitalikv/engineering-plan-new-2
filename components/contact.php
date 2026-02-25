<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	exit;
}

$name = trim($_POST['name'] ?? '');
$mail = trim($_POST['mail'] ?? '');
$text = trim($_POST['text'] ?? '');

// Удаляем переносы строк для защиты от header injection
$name = str_replace(["\r", "\n"], '', $name);
$mail = str_replace(["\r", "\n"], '', $mail);

$name = htmlentities($name, ENT_QUOTES, 'UTF-8');
$text = htmlentities($text, ENT_QUOTES, 'UTF-8');

if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
	echo 'Некорректно указана почта';
	exit;
}

$mail_form = "Content-type:text/html; Charset=utf-8\r\nFrom:mail@engineering-plan.ru";
$email = 'engineering-plan@mail.ru';
$tema = "Сообщение с сайта ИНЖЕНЕРНЫЙ ПЛАН";
$mess = $name . '<br>' . $mail . '<br><br>' . $text;
mail($email, $tema, $mess, $mail_form);

echo 'Спасибо! Мы приняли ваше сообщение.';
