"use strict";
const itemList = [];
const select = (name) => document.querySelector(name);
const selectAll = (name) => document.querySelectorAll(name);
let currentMonthMenu = selectAll(`#monthMenu li`)[new Date().getMonth()];
function jsonToArray(data) {
  for (let i = 0; i < data.length; i++) {
    itemList.push(data[i]);
  }
  deadlineOfFoodMonth();
  return itemList;
}
function makeLITag(itemList, orderType) {
  for (let i = 0; i < itemList.length; i++) {
    let foodMonthsInnerHtml = "";
    for (let j = 0; j < itemList[i].foodMonths.length; j++) {
      foodMonthsInnerHtml += `<span class="m${itemList[i].foodMonths[j]}">${itemList[i].foodMonths[j]}</span>`;
    }
    const html = `
      <li>
        <b class="foodMonths">${foodMonthsInnerHtml}</b>
        <b class="foodName">${itemList[i].foodName}</b>
        <i class="foodHashtags">${itemList[i].foodHashtags}</i>
      </li>
      `;
    select(`#${orderType}`).innerHTML += html;
    for (let j of itemList[i].foodMonths) {
      selectAll(`#${orderType} li`)[i].classList.add(`m${j}`);
    }
    for (let j of itemList[i].foodMonthsDeadline) {
      selectAll(`#${orderType} li`)[i].classList.add(`d${j}`);
    }
    if (itemList[i].foodMonths.length == 12) {
      selectAll(`#${orderType} li`)[i].classList.add(`year`);
    }
  }
}
function filterMonth(menuName) {
  for (let i = 0; i < itemList.length * 2; i++) {
    !selectAll(`main li`)[i].classList.contains(`m${menuName}`)
      ? selectAll(`main li`)[i].classList.add("hide")
      : selectAll(`main li`)[i].classList.remove("hide");
    selectAll(`main li`)[i].classList.contains(`d${menuName}`)
      ? selectAll(`main li`)[i].classList.add("deadline")
      : selectAll(`main li`)[i].classList.remove("deadline");
  }
}
function filterSort(orderTypeOn) {
  let orderTypeOff;
  orderTypeOn == "Period" ? (orderTypeOff = "Name") : (orderTypeOff = "Period");
  select(`#listSortBy${orderTypeOff}`).classList.add("hide");
  select(`#listSortBy${orderTypeOn}`).classList.remove("hide");
  select(`#menuSortBy${orderTypeOff}`).classList.remove("active");
  select(`#menuSortBy${orderTypeOn}`).classList.add("active");
}
function toggleClassOfAllListItems(selector, className) {
  for (let i = 0; i < itemList.length * 2; i++) {
    selectAll(selector)[i].classList.toggle(className);
  }
}
function activeMenuMonthOrTotal(e) {
  currentMonthMenu.classList.remove("active");
  e.target.classList.add("active");
  currentMonthMenu = e.target;
}
function deadlineOfFoodMonth() {
  for (let i = 0; i < itemList.length; i++) {
    let tempFirstMonthOfNextYear = `${
      12 + parseInt(itemList[i].foodMonths[0], 10)
    }`;
    itemList[i].foodMonthsDeadline = [];
    itemList[i].foodMonths.push(tempFirstMonthOfNextYear);
    for (let j = 0; j < itemList[i].foodMonths.length - 1; j++) {
      if (
        itemList[i].foodMonths[j + 1] !=
        parseInt(itemList[i].foodMonths[j], 10) + 1
      ) {
        itemList[i].foodMonthsDeadline.push(itemList[i].foodMonths[j]);
      }
    }
    itemList[i].foodMonths.pop();
  }
}
function writeHTML(itemList) {
  makeLITag(itemList, "listSortByName");
  select(`#listSortByName`).classList.add("hide");
  itemList.sort((a, b) => a.foodMonths.length - b.foodMonths.length);
  makeLITag(itemList, "listSortByPeriod");
  currentMonthMenu.classList.add("active");
  select(`#menuSortByPeriod`).classList.add("active");
  select(`#menuFoodMonths`).classList.add("active");
  select(`#menuFoodHashtags`).classList.add("active");
  filterMonth(currentMonthMenu.innerHTML);
}
function clickMenu(e) {
  if (e.target.tagName == "LI") {
    let menuName = e.target.innerHTML;
    switch (menuName) {
      case "전체":
        for (let i = 0; i < itemList.length * 2; i++) {
          selectAll(`main li`)[i].classList.remove("hide");
          selectAll(`main li`)[i].classList.contains(`d${menuName}`)
            ? selectAll(`main li`)[i].classList.add("deadline")
            : selectAll(`main li`)[i].classList.remove("deadline");
        }
        activeMenuMonthOrTotal(e);
        break;
      case "기간이 짧은 순":
        filterSort("Period");
        break;
      case "가나다 순":
        filterSort("Name");
        break;
      case "제철":
        toggleClassOfAllListItems(".foodMonths", "hide");
        e.target.classList.toggle("active");
        break;
      case "검색어":
        toggleClassOfAllListItems(".foodHashtags", "hide");
        e.target.classList.toggle("active");
        break;
      case "다크 모드":
        select(`body`).classList.toggle("darkMode");
        toggleClassOfAllListItems("main li", "darkMode");
        e.target.classList.toggle("active");
        break;
      case "인쇄":
        window.print();
        break;
      case menuName:
        filterMonth(menuName);
        activeMenuMonthOrTotal(e);
        break;
    }
  }
}
function clickLogo() {
  location.reload();
}
fetch("foodData.json")
  .then((response) => response.json())
  .then((data) => jsonToArray(data))
  .then((itemList) => writeHTML(itemList));
select("nav").addEventListener("click", clickMenu);
select("header").addEventListener("click", clickLogo);
