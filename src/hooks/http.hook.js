import {useState, useCallback} from "react";

export const useHttp = () => {
  /* Создаем стейт для загрузки и еррора */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // cоздаем еще одно состояние для процесса который будет проиходить
  const [process, setProcess] = useState('waiting');

  /* Создаем функцию запроса с аргументами url, method, body, headers */
  const request = useCallback( async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

    /* Если функция вызвалась, загрузка на тру */
    setLoading(true);
    setProcess('loading');

    /* Здесь мы оборачиваем конструкцию чтобы обрабатывать ошибку  */
    try {
      /* Отправляем запрос */
      const response = await fetch(url, {method, body, headers});

      /* Если запрос не ОК - ошибка */
      if (!response.ok) {
        throw new Error(`Could not fetch ${url}, status: ${response.status}`);
      }

      /* Если не дошло до ошибки, переобразуем в json */
      const data = await response.json();

      /* Загрузку выключаем */
      setLoading(false);

      /* Возвращаем данные */
      return data;

      /* Если ошибка */
    } catch(e) {
      setLoading(false);
      setError(e.message);
      setProcess('error');
      throw e;
    }
  }, [])

  /* Функция обнуления ошибки */
  const clearError = useCallback(() => {
    setError(null)
    setProcess('loading')
  }, [])

  return {loading, request, error, clearError, process, setProcess}
}