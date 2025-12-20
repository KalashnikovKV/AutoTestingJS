/* eslint-disable no-console */
const { request } = require('@playwright/test');

class ApiClient {
  constructor(baseURL = 'https://demoqa.com') {
    this.baseURL = baseURL;
    this.token = null;
    this.userId = null;
  }

  async createApiContext() {
    return await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createUser(userName, password) {
    const apiContext = await this.createApiContext();
    const response = await apiContext.post('/Account/v1/User', {
      data: {
        userName,
        password,
      },
    });

    const responseData = await response.json();
    
    if (response.status() === 201) {
      this.userId = responseData.userID;
      return {
        success: true,
        userId: responseData.userID,
        username: responseData.username,
        books: responseData.books || [],
      };
    } else {
      return {
        success: false,
        code: responseData.code,
        message: responseData.message,
      };
    }
  }

  async generateToken(userName, password) {
    const apiContext = await this.createApiContext();
    const response = await apiContext.post('/Account/v1/GenerateToken', {
      data: {
        userName,
        password,
      },
    });

    const responseData = await response.json();
    
    if (response.status() === 200 && responseData.token) {
      this.token = responseData.token;
      return {
        success: true,
        token: responseData.token,
        expires: responseData.expires,
        status: responseData.status,
        result: responseData.result,
      };
    } else {
      return {
        success: false,
        status: responseData.status,
        result: responseData.result,
        message: responseData.message,
      };
    }
  }

  async getBooks() {
    const apiContext = await this.createApiContext();
    const response = await apiContext.get('/BookStore/v1/Books');

    if (response.status() === 200) {
      const responseData = await response.json();
      return {
        success: true,
        books: responseData.books || [],
      };
    } else {
      const responseData = await response.json();
      return {
        success: false,
        message: responseData.message || 'Failed to get books',
      };
    }
  }

  async addBooksToCollection(userId, token, isbns) {
    const apiContext = await this.createApiContext();
    const response = await apiContext.post('/BookStore/v1/Books', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId,
        collectionOfIsbns: isbns.map(isbn => ({ isbn })),
      },
    });

    const responseData = await response.json();

    if (response.status() === 201) {
      return {
        success: true,
        books: responseData.books || [],
      };
    } else {
      return {
        success: false,
        code: responseData.code,
        message: responseData.message,
      };
    }
  }

  async getUser(userId, token) {
    const apiContext = await this.createApiContext();
    const response = await apiContext.get(`/Account/v1/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const statusCode = response.status();
    let responseData = {};
    let responseText = '';

    try {
      responseText = await response.text();
      if (responseText && responseText.trim()) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          responseData = { rawResponse: responseText };
        }
      }
    } catch (error) {
      // Ignore response parsing errors
    }

    if (statusCode === 200) {
      return {
        success: true,
        userId: responseData.userId,
        username: responseData.username,
        books: responseData.books || [],
      };
    } else {
      return {
        success: false,
        statusCode,
        code: responseData.code,
        message: responseData.message || responseData.rawResponse || `HTTP ${statusCode}`,
        responseData,
      };
    }
  }

  async deleteBook(userId, token, isbn, maxRetries = 2) {
    const apiContext = await this.createApiContext();
    
    const requestVariants = [
      {
        name: 'fetch with body (isbn & userId)',
        url: '/BookStore/v1/Book',
        useFetch: true,
        body: {
          isbn,
          userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      {
        name: 'fetch with body (userId & isbn)',
        url: '/BookStore/v1/Book',
        useFetch: true,
        body: {
          userId,
          isbn,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      {
        name: 'delete with postData (isbn & userId)',
        url: '/BookStore/v1/Book',
        useFetch: false,
        options: {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          postData: JSON.stringify({
            isbn,
            userId,
          }),
        },
      },
      {
        name: 'query params (UserId & isbn)',
        url: `/BookStore/v1/Book?UserId=${encodeURIComponent(userId)}&isbn=${encodeURIComponent(isbn)}`,
        useFetch: false,
        options: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
      {
        name: 'query params (isbn & userId)',
        url: `/BookStore/v1/Book?isbn=${encodeURIComponent(isbn)}&userId=${encodeURIComponent(userId)}`,
        useFetch: false,
        options: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    ];

    for (const variant of requestVariants) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Trying DELETE ${variant.name} (attempt ${attempt}/${maxRetries})...`);
          console.log(`URL: ${variant.url}`);
          
          let response;
          if (variant.useFetch) {
            console.log(`Body: ${JSON.stringify(variant.body)}`);
            response = await apiContext.fetch(variant.url, {
              method: 'DELETE',
              headers: {
                ...variant.headers,
                'Content-Type': 'application/json',
              },
              data: JSON.stringify(variant.body),
            });
          } else {
            console.log(`Options: ${JSON.stringify({ ...variant.options, headers: { ...variant.options.headers, Authorization: 'Bearer ***' } }, null, 2)}`);
            response = await apiContext.delete(variant.url, variant.options);
          }
          
          const statusCode = response.status();
          
          let responseText = '';
          
          try {
            responseText = await response.text();
          } catch (textError) {
            // Ignore text extraction errors
          }
          
          // eslint-disable-next-line no-console
          console.log(`DELETE ${variant.name} - Status: ${statusCode}, Response: ${responseText.substring(0, 200) || '(empty)'}`);
          
          if (statusCode === 204 || statusCode === 200) {
            return {
              success: true,
              statusCode,
              method: variant.name,
            };
          }
          
          if (statusCode === 502 && attempt < maxRetries) {
            // eslint-disable-next-line no-console
            console.log(`Got 502 Bad Gateway, retrying in ${attempt * 1000}ms...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            continue;
          }
          
          if (statusCode !== 502) {
            break;
          }
          
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error in DELETE ${variant.name} (attempt ${attempt}):`, error.message);
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            continue;
          }
        }
      }
    }

    return {
      success: false,
      statusCode: 502,
      message: 'All DELETE request variants failed. Server returned 502 Bad Gateway. This may be a temporary server issue.',
    };
  }

  setToken(token) {
    this.token = token;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }
}

module.exports = ApiClient;

