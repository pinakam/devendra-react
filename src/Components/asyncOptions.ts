const token =localStorage.getItem('token')

const loadOptions = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    const response = await fetch('https://eaf-dms-api.yecor.com/api/inventory/product-SKUs/?warehouse_id=22&ordering=name&search=&limit=10&offset=&remove_product_stocking=true',{
        headers: {
            'Authorization': `Bearer ${token}`,
          },
    })  
    const responseJSON = await response.json();
    console.log(responseJSON);
    
    return {
      options: responseJSON.data || [],
      hasMore: Math.ceil(responseJSON.totalResults / 10) > page,
      additional: {
        page: searchQuery ? 1 : page + 1,
      },
    };
  };
  
  export default loadOptions;
  