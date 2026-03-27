import API from './api';

export const categoryService = {
  /**
   * Fetch all categories from the backend.
   * @returns {Promise<Array>} Array of category objects.
   */
  async getAllCategories() {
    try {
      const response = await API.get('/categories/getAllCategories');
      const data = response.data;
      if (data.success) {
        console.log(data);
        return data.data.map(c => ({
          id: c.id,
          name: c.categoryname
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch categories API level', error);
      throw error;
    }
  }
};
