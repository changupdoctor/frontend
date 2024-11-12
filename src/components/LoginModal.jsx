import React, { useState, useEffect } from 'react';
import http from '../api/http';
import { useNavigate } from "react-router-dom";

function LoginModal({ setLoginModal, setLoginComplete }) {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const closeModal = () => {
    setLoginModal(false);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    const loginData= {
      login_id: id,
      login_pw: pw
    }
    try {
      console.log(loginData)
      const response = await http.post('/analysis/login', loginData);
      console.log('Login response:', response.data);
      // 로그인 성공 시 추가 로직
      const userName = response.data.username;
      sessionStorage.setItem('userName', userName);
      sessionStorage.setItem('userId', id);
      setSuccessMessage("로그인 성공!");
      
      setLoginComplete(true);  // 로그인 성공 상태 설정
      setLoginModal(false);
      navigate('/')
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("아이디와 비밀번호가 일치하지 않습니다.");
      } else {
        setErrorMessage("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg w-full sm:max-w-md">
        <div className="flex justify-between mb-10">
          <span className="text-3xl font-semibold">로그인</span>
          <button
            className="hover:bg-gray-400 text-gray-800 font-semibold rounded-lg"
            onClick={closeModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} */}
        <form onSubmit={ handleLogin }>
          {errorMessage && (
            <div id="toast-danger" className="flex items-center w-full max-w-full p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                </svg>
                <span className="sr-only">Error icon</span>
              </div>
              <div className="ms-3 text-sm font-normal">{errorMessage}</div>
              <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" onClick={() => setErrorMessage("")} aria-label="Close">
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </button>
            </div>
          )}
          {successMessage && (
            <div id="toast-success" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
              <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
                <span className="sr-only">Check icon</span>
              </div>
              <div className="ms-3 text-sm font-normal">{successMessage}</div>
              <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" onClick={() => setSuccessMessage("")} aria-label="Close">
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </button>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">아이디</label>
            <input
              type="text"
              id="login_id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border-gray-300 rounded-md mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onFocus={() => setErrorMessage("")} // 입력할 때 오류 메시지 제거
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="pw" className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              id="login_pw"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full border-gray-300 rounded-md mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onFocus={() => setErrorMessage("")} // 입력할 때 오류 메시지 제거
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#5D70DF] text-white px-4 py-2 rounded-md hover:bg-[#D7E2FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;