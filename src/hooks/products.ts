import {useEffect, useState} from "react";
import {IOutlet} from "interfaces/outlets";
import {IMarket} from "interfaces/markets";
import {useList, useOne} from "@pankod/refine-core";


export const useOutletsList = () => {

  const [searchOutletValue, setSearchOutletValue] = useState('');

  const outletsSelectProps = useList<IOutlet>({
    resource: "outlets",
    dataProviderName: "autocompleteProvider",
    config: {
      filters: [{
        field: "title_like",
        operator: "eq",
        value: searchOutletValue,
      }]
    }
  });

  return {
    outletsSelectProps,
    searchOutletValue,
    setSearchOutletValue
  }
}


export const useMarketsList = () => {

  const [searchMarketValue, setSearchMarketValue] = useState('');

  const marketsSelectProps = useList<IMarket>({
    resource: "markets",
    dataProviderName: "autocompleteProvider",
    config: {
      filters: [{
        field: "title_like",
        operator: "eq",
        value: searchMarketValue,
      }]
    }
  });

  return {
    marketsSelectProps,
    setSearchMarketValue
  }
}

export const useProductInfo = (outletId: number | string | null, categoryId?: number | null) => {
  const [selectOutletId, setSelectOutletId] = useState<number | string | null>(outletId || null)
  const [selectMarketId, setSelectMarketId] = useState<number | string | null>(null)

  const [selectCategoryId, setSelectCategoryId] = useState<number | null>(categoryId || null)

  const outletProps = useOne<IOutlet>({
    resource: "outlets",
    id: !selectOutletId ? '' : `${selectOutletId}`,
    dataProviderName: "customProvider",
  })

  const marketProps = useOne<IMarket>({
    resource: "markets",
    id: !selectMarketId ? '' : `${selectMarketId}`,
    dataProviderName: "customProvider",
  })

  useEffect(() => {
    if (outletId && categoryId) {
      setSelectOutletId(outletId)
      setSelectCategoryId(categoryId)
    }
  }, [outletId, categoryId])

  useEffect(() => {
    if (outletProps?.data?.data) {
      setSelectMarketId(outletProps?.data?.data?.marketId)
    }
  }, [outletProps])


  return {
    outletProps: outletProps?.data?.data,
    marketProps: marketProps?.data?.data,
    changeOutlet: setSelectOutletId
  }
}


export const useOutletInfo = (initialValues: any | null) => {

  const [selectMarketId, setSelectMarketId] = useState<number | null>(initialValues?.marketId || '');
  const [selectMarket, setSelectMarket] = useState<IMarket | null>(null);

  const marketProps = useOne<IMarket>({
    resource: "markets",
    id: !selectMarketId ? '' : `${selectMarketId}`,
    dataProviderName: "customProvider",
  })

  useEffect(() => {
    if (initialValues?.marketId) {
      setSelectMarketId(initialValues?.marketId)
    }
  }, [initialValues])

  useEffect(() => {
    if (marketProps?.data?.data) {
      setSelectMarket(marketProps?.data?.data)
    }
  }, [marketProps])

   return {
     marketProps: selectMarket,
     changeMarket: setSelectMarketId
   }
}