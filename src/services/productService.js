import API from './api';

export const productService = {
  /**
   * Fetch all products from the backend.
   * @returns {Promise<Array>} Array of mapped product objects.
   */
  async getAllProducts() {
    try {
      const response = await API.get('/products/getAllProducts');
      const data = response.data;
      if (data.success) {
        return data.data.map(p => ({
          id: p.id,
          name: p.productName,
          sku: p.sku,
          category: p.categoryName,
          unitQuantity: p.quantity,
          mismatch: 0, 
          price: Number(p.price) || 0,
          supplierId: null
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch products API level', error);
      throw error;
    }
  },

  /**
   * Add a new product to the backend.
   * @param {Object} product - The mapped frontend product model
   * @returns {Promise<Object>} The server response
   */
  async addProduct(product) {
    const payload = {
      productName: product.name,
      categoryId: Number(product.category) || 1,
      minStock: 5,
      sku: product.sku,
      unit: Number(product.unitQuantity) || 1,
      quantityPerUnit: 1,
      supplierId: Number(product.supplierId) || 1,
      missmatch: {
        add: false,
        subtract: false,
        quantityNumber: Number(product.mismatch) || 0
      },
      pricePerQuantity: Number(product.price) || 0
    };

    try {
      const response = await API.post('/products/addProduct', payload);
      return response.data;
    } catch (error) {
      console.error('Error adding product API level', error);
      throw error;
    }
  }
};
