import React, { useState, useEffect } from "react";
import "./Index.css";
import http from "../../api/http.js";
import logo from "../../assets/Rocket-small.svg";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Modal from "react-modal";
import LoginModal from "../../components/LoginModal";
import SignupModal from "../../components/SignupModal";
import { useNavigate } from "react-router-dom";
import { regions, categories } from "../../assets/category.js";
import CoinRain from "../../components/CoinRain.jsx";
import SynergyInfo from "../../components/SynergyInfo.jsx";


function Index() {
  const navigate = useNavigate();
  const [selectedValue1, setSelectedValue1] = useState("대분류 선택");
  const [selectedValue2, setSelectedValue2] = useState("선택");
  const [sliderValue, setSliderValue] = useState(1000);
  const [signupModal, setSignupModal] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [location, setLocation] = useState("");
  const [ageGroups, setAgeGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [city, setCity] = useState("");
  const [addr, setAddr] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const storedUserName = sessionStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
      setIsLoggedIn(true);
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  useEffect(() => {
    if (loginComplete) {
      const storedUserName = sessionStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
        setIsLoggedIn(true);
      }
    }
  }, [loginComplete]); // 로그인 완료 상태가 변경될 때 실행
  const handleLocationChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const results = [];
    for (const [region, subregions] of Object.entries(regions)) {
      for (const subregion of subregions) {
        if (subregion.includes(term)) {
          results.push({ region, subregion });
        }
      }
    }
    setFilteredResults(results);
  };
  const handleSelect = (region, subregion) => {
    setCity(region);
    setAddr(subregion);
    setSearchTerm(`${region} ${subregion}`);
    setFilteredResults([]);
  };
  const selectValue1 = (value) => {
    setSelectedValue1(value);
    setSelectedValue2("소분류 선택"); // 대분류 변경 시 소분류 초기화
  };
  const selectValue2 = (value) => {
    setSelectedValue2(value);
  };
  const handleSvgClick = () => {
    setFilteredResults(regions);
    console.log(filteredResults);
  };
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };
  const closeSignupModal = () => {
    setSignupModal(false);
  };
  const closeLoginModal = () => {
    setLoginModal(false);
  };
  const handleAgeGroupChange = (event) => {
    const value = event.target.value;
    setAgeGroups((prev) =>
      prev.includes(value)
        ? prev.filter((age) => age !== value)
        : [...prev, value]
    );
  };
  const handleExamine = (event) => {
    event.preventDefault();
    if (sessionStorage.getItem('userId')) {
      document.querySelector('.logo').classList.add('animate');
      const data = {
        region_city: city,
        region_dong: addr,
        category1: selectedValue1,
        category2: selectedValue2,
        customerAge: ageGroups,
      };
      console.log(data);
      navigate("/report", {
        state: { city, addr, selectedValue1, selectedValue2, data },
      });
    } else {
      setErrorMessage('진단을 위해서는 로그인이 필요합니다!')
    }
  };
  const signup = () => {
    setSignupModal(true);
  };

  const signin = () => {
    setLoginModal(true);
  };
  const signout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <div className="background">
      <Modal
        isOpen={signupModal}
        onRequestClose={closeSignupModal}
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <SignupModal
          setSignupModal={setSignupModal}
          setSignupComplete={(res) => {
            if (res) {
              setSignupComplete(true);
            }
          }}
        />
      </Modal>
      <Modal
        isOpen={loginModal}
        onRequestClose={closeLoginModal}
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <LoginModal
          setLoginModal={setLoginModal}
          setLoginComplete={(res) => {
            if (res) {
              setLoginComplete(true);
            }
          }}
        />
      </Modal>
      <div class="mx-auto mt-16 max-w-2xl rounded-3xl sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
        <div class="p-8 sm:p-10 lg:flex-auto justify-center">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mx-auto">
                <img className="logo" src={logo} alt="" />
            </div>
            <div className="mx-auto">
                <p className="mt-6 text-5xl text-center">창업닥터, 창업에 날개를 달아줘요</p>
            </div>
          </div>
        </div>
        <div class="mt-2 p-8 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div class="shadow-xl rounded-2xl bg-gray-50 py-10 ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div class="px-8">
              <span className="text-3xl">창업 문진</span>
              <form onSubmit={handleExamine}>
                <p class="mt-6 flex items-baseline gap-x-2">
                  <span class="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    희망 창업 지역이 어디세요?
                  </span>
                </p>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                  <input
                    type="text"
                    onChange={handleLocationChange}
                    value={searchTerm}
                    name="location"
                    id="location"
                    className="block w-full bg-[#D7E2FF] rounded-md py-1.5 pl-10 pr-20 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="철산3동"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
                    <svg
                      className="w-6 h-6 text-gray-800"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  {filteredResults.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto" id="scrollbar5">
                      {filteredResults.map((result, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            handleSelect(result.region, result.subregion)
                          }
                          className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                        >
                          {result.region} {result.subregion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p class="mt-6 flex items-baseline gap-x-2">
                  <span class="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    희망 업종이 어떻게 되세요?
                  </span>
                </p>
                <div className="relative mt-4 text-left">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-between w-40 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-black text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100">
                        {selectedValue2}
                        <ChevronDownIcon
                          className="w-5 h-5 ml-2 -mr-1"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                      <div className="py-1">
                        {Object.keys(categories).map((category) => (
                          <Menu.Item key={category}>
                            {({ active }) => (
                              <div className="relative">
                                <Menu as="div">
                                  <Menu.Button
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 cursor-pointer`}
                                    onClick={() => selectValue1(category)}
                                  >
                                    {category}
                                    <ChevronRightIcon
                                      className="w-5 h-5 ml-2 -mr-1"
                                      aria-hidden="true"
                                    />
                                  </Menu.Button>
                                  <Menu.Items className="absolute left-full top-0 mt-0 ml-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 overflow-y-auto max-h-60"  id="scrollbar5">
                                    <div className="py-1">
                                      {categories[category].map(
                                        (subcategory) => (
                                          <Menu.Item key={subcategory}>
                                            {({ active }) => (
                                              <a
                                                onClick={() =>
                                                  selectValue2(subcategory)
                                                }
                                                className={`${
                                                  active ? "bg-gray-100" : ""
                                                } block px-4 py-2 text-sm text-gray-700 cursor-pointer`}
                                              >
                                                {subcategory}
                                              </a>
                                            )}
                                          </Menu.Item>
                                        )
                                      )}
                                    </div>
                                  </Menu.Items>
                                </Menu>
                              </div>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Menu>
                </div>
                <p class="mt-6 flex items-baseline gap-x-2">
                  <span class="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    희망 매출액이 어떻게 되세요?
                  </span>
                </p>
                <div class="relative mb-10">
                  <label for="labels-range-input" class="sr-only">
                    Labels range
                  </label>
                  <input
                    id="labels-range-input"
                    type="range"
                    value={sliderValue}
                    min="0"
                    max="1000"
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5D70DF] dark:bg-gray-700"
                  />
                  <span class="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
                    0
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
                    500만원
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
                    1억
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
                    1000억
                  </span>
                </div>
                <p class="mt-6 flex items-baseline gap-x-2 mb-6">
                  <span class="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    주 고객층의 연령은 어떻게 되세요?
                  </span>
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    "10대 이하",
                    "20대",
                    "30대",
                    "40대",
                    "50대",
                    "60대",
                    "70대",
                    "80대 이상",
                  ].map((age) => (
                    <div className="flex items-center" key={age}>
                      <input
                        id={`age-checkbox-${age}`}
                        type="checkbox"
                        value={age}
                        onChange={handleAgeGroupChange}
                        className="w-4 h-4 accent-[#5D70DF] rounded"
                      />
                      <label
                        htmlFor={`age-checkbox-${age}`}
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {age}
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  class="mt-10 block w-full rounded-full bg-[#5D70DF] px-3 py-2 text-center text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  진단 받기
                </button>
                {errorMessage && (
                  <div id="toast-danger" className="fixed flex items-center max-w-full p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
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
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {isLoggedIn ? (
          <div className="buttons text-xl">
            <p className="mt-5 mr-3">{`환영합니다, ${userName} 님`}</p>
            <button
              type="button"
              className="btn-white2"
              onClick={() => signout()}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button
              type="button"
              className="btn-white"
              onClick={() => signup()}
            >
              회원가입
            </button>
            <button
              type="button"
              className="btn-transparent"
              onClick={() => signin()}
            >
              로그인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
