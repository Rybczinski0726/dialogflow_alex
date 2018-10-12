'use strict';
const express = require('express');
const salesData = require('./data/SalesData.json');
const salesByCountry = require('./data/SalesByCountry.json');
const salesByDivision = require('./data/SalesByDivision.json');
var router = express.Router();
//GET
router.get('/:division?/:country?/:period?',function(request, response) {
  const division = request.params.division;
  const country   = request.params.country;
  const period   = request.params.period;
  // if (!division) {
  //   return response.status(400).json({error: 'Incorrect Division'});
  // }
  //부문으로 1차 필터
  let sales = [];
  if(division){
    sales = salesData.filter(responseSales => responseSales.Division === division);
  }
  //기간이 조건으로 올 경우 위 데이터를 다시 기간으로 필터
  if(period){
    sales = sales.filter(responseSales => responseSales.Period === period);
  }
  //나라가 조건으로 올 경우 위 데이터를 다시 기간으로 필터
  if(country){
    sales = sales.filter(responseSales => responseSales.Country === country);
  }
  //조회한 결과가 없을 경우 에러
  if (sales.length <1) {
    return response.status(404).json({error: 'Data not found!'});
  }
  //결과 리턴
  return response.json(sales);
})
//post
router.post('/',function(request, response) {
  //body에서 파라미터 추출
  const division = request.body.Division;
  const country   = request.body.Country;
  const period   = request.body.Period;
  // console.log(division);
  // console.log(country);
  // console.log(period);
  let sales = [];
  if(division){
    sales = salesData.filter(responseSales => responseSales.Division === division);
  }
  //기간이 조건으로 올 경우 위 데이터를 다시 기간으로 필터
  if(period){
    if(sales.length<1){
      sales = salesData.filter(responseSales => responseSales.Period === period);
    } else  {
    sales = sales.filter(responseSales => responseSales.Period === period);
  }
  }
  //나라가 조건으로 올 경우 위 데이터를 다시 기간으로 필터
  if(country){
    if(sales.length<1){
      sales = salesData.filter(responseSales => responseSales.Country === country);
    } else  {
    sales = sales.filter(responseSales => responseSales.Country === country);
  }
  }
  //조회한 결과가 없을 경우 에러
  if (sales.length <1) {
    return response.status(404).json({error: 'Data not found!'});
  }
  //결과 리턴
  return response.json(sales);
})
//ByCountry
router.post('/Country',function(request, response) {
  const sDate = request.body.Date;
  const sCountry = request.body.Country;
  let sales = [];
  //조건이 없을 경우 전체 리턴
  if(sDate==undefined && sCountry==undefined){
    sales = salesByCountry;
  } else {
    //기간이 조건으로 올 경우 위 데이터를 다시 기간으로 필터
    if(sDate){
      sales = salesByCountry.filter(responseSales => responseSales.Date === sDate);
    }
    //국가명이 올 경우 국가로 필터
    if(sCountry){
      if(sales.length<1){
        sales = salesByCountry.filter(responseSales => responseSales.Country === sCountry);
      } else  {
      sales = sales.filter(responseSales => responseSales.Country === sCountry);
      }
    }
  }
  //조회한 결과가 없을 경우 에러
  if (sales.length <1) {
    return response.status(404).json({error: 'Data not found!'});
  }
  //결과 리턴
  return response.json(sales);
})
//ByDivision
router.post('/Division',function(request, response) {
  const sDate = request.body.Date;
  const sDivision = request.body.Division;
  let sales = [];
  if(sDate==undefined && sDivision==undefined){
    sales = salesByDivision;
  } else {
  //기간이 조건으로 올 경우 위 데이터를 다시 기간으로 필터
  if(sDate){
    sales = salesByDivision.filter(responseSales => responseSales.Date === sDate);
  }
  //국가명이 올 경우 국가로 필터
  if(sDivision){
    if(sales.length<1){
      sales = salesByDivision.filter(responseSales => responseSales.Division === sDivision);
    } else  {
    sales = sales.filter(responseSales => responseSales.Division === sDivision);
  }
  }
  }

  //조회한 결과가 없을 경우 에러
  if (sales.length <1) {
    return response.status(404).json({error: 'Data not found!'});
  }
  //결과 리턴
  return response.json(sales);
})

module.exports = router;
