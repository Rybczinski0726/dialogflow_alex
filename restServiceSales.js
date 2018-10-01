'use strict';
const express = require('express');
const salesData = require('./data/SalesData.json');
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

module.exports = router;
