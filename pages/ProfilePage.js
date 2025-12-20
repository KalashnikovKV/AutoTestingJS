const BasePage = require('./BasePage');
const { TIMEOUTS } = require('../utils/constants');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      profileLink: 'text=Profile',
      bookRows: '.rt-tbody .rt-tr-group:not([class*="rt-tr-group"])',
      bookRow: '.rt-tbody .rt-tr-group',
      bookTitle: '.rt-td:nth-child(2)',
      bookAuthor: '.rt-td:nth-child(3)',
      bookPublisher: '.rt-td:nth-child(4)',
      deleteButton: '[id^="delete-record-"]',
      deleteButtonByText: 'text=Delete',
      deleteButtonInRow: 'span:has-text("Delete")',
      confirmDeleteButton: '#closeSmallModal-ok',
      noDataMessage: '.rt-noData',
      userNameValue: '#userName-value',
      booksTable: '.rt-table',
    };
  }

  async navigateToProfile() {
    await this.navigateTo('/profile');
  }

  async clickProfileLink() {
    await this.waitForElementVisible(this.selectors.profileLink);
    await this.clickElement(this.selectors.profileLink);
    await this.page.waitForLoadState('networkidle');
  }

  async getBooksFromTable() {
    try {
      await this.page.waitForSelector(this.selectors.booksTable, { timeout: 10000 });
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      
      await this.page.waitForTimeout(2000);
    } catch (error) {
      if (error.message.includes('closed') || error.message.includes('Target')) {
        throw error;
      }
      return [];
    }
    
    const books = [];
    
    try {
      await this.page.waitForSelector(`${this.selectors.bookRow} ${this.selectors.bookTitle}`, { timeout: 5000, state: 'visible' }).catch(() => {
      });
    } catch (error) {
    }
    
    const bookRows = await this.page.locator(this.selectors.bookRow).all();
    
    for (const row of bookRows) {
      try {
        const titleElement = row.locator(this.selectors.bookTitle).first();
        const isVisible = await titleElement.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          const title = await titleElement.textContent().catch(() => '');
          
          if (title && title.trim() && title.trim() !== '' && title.trim() !== 'Title') {
            const authorElement = row.locator(this.selectors.bookAuthor).first();
            const publisherElement = row.locator(this.selectors.bookPublisher).first();
            
            const author = await authorElement.textContent().catch(() => '');
            const publisher = await publisherElement.textContent().catch(() => '');
            
            books.push({
              title: title.trim(),
              author: author.trim(),
              publisher: publisher.trim(),
            });
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    return books;
  }

  async isBookInCollection(bookTitle) {
    const books = await this.getBooksFromTable();
    return books.some(book => 
      book.title.toLowerCase().includes(bookTitle.toLowerCase()) ||
      bookTitle.toLowerCase().includes(book.title.toLowerCase())
    );
  }

  async getBooksCount() {
    const books = await this.getBooksFromTable();
    return books.length;
  }

  async deleteBookByTitle(bookTitle) {
    try {
      await this.page.waitForSelector(this.selectors.booksTable, { timeout: 5000 });
      await this.page.waitForLoadState('domcontentloaded');
    } catch (error) {
      if (error.message.includes('closed') || error.message.includes('Target')) {
        throw error;
      }
    }
    
    const bookRows = await this.page.locator(this.selectors.bookRow).all();
    
    for (const row of bookRows) {
      try {
        const titleElement = row.locator(this.selectors.bookTitle).first();
        const isVisible = await titleElement.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          const title = await titleElement.textContent().catch(() => '');
          
          if (title && title.trim() && (
              title.trim().toLowerCase().includes(bookTitle.toLowerCase()) ||
              bookTitle.toLowerCase().includes(title.trim().toLowerCase())
            )) {
            let deleteBtn = null;
            let deleteBtnVisible = false;
            
            deleteBtn = row.locator(this.selectors.deleteButtonByText).first();
            deleteBtnVisible = await deleteBtn.isVisible({ timeout: 1000 }).catch(() => false);
            
            if (!deleteBtnVisible) {
              deleteBtn = row.locator(this.selectors.deleteButton).first();
              deleteBtnVisible = await deleteBtn.isVisible({ timeout: 1000 }).catch(() => false);
            }
            
            if (!deleteBtnVisible) {
              const lastCell = row.locator('.rt-td').last();
              deleteBtn = lastCell.locator('span, button, a').filter({ hasText: /delete/i }).first();
              deleteBtnVisible = await deleteBtn.isVisible({ timeout: 1000 }).catch(() => false);
            }
            
            if (!deleteBtnVisible) {
              deleteBtn = row.locator('[title*="Delete"], [aria-label*="Delete"], [title*="delete"], [aria-label*="delete"]').first();
              deleteBtnVisible = await deleteBtn.isVisible({ timeout: 1000 }).catch(() => false);
            }
            
            if (deleteBtnVisible && deleteBtn) {
              await deleteBtn.scrollIntoViewIfNeeded();
              
              await deleteBtn.waitFor({ state: 'visible', timeout: 2000 });
              
              await deleteBtn.click();
              
              await this.confirmDelete();
              
              try {
                await this.page.waitForLoadState('networkidle', { timeout: 3000 });
              } catch (error) {
              }
              
              console.log(`Successfully clicked delete button for book "${title.trim()}"`);
              return;
            } else {
              console.warn(`Delete button not found for book "${title.trim()}"`);
            }
          }
        }
      } catch (error) {
        console.warn(`Error processing row: ${error.message}`);
        continue;
      }
    }
    
    throw new Error(`Book with title "${bookTitle}" not found for deletion or delete button not found`);
  }

  async confirmDelete() {
    await this.waitForElementVisible(this.selectors.confirmDeleteButton, 3000);
    await this.clickElement(this.selectors.confirmDeleteButton);
    await this.page.waitForTimeout(500);
  }

  async isCollectionEmpty() {
    try {
      const noDataMessage = await this.page.locator(this.selectors.noDataMessage).isVisible({ timeout: 2000 });
      if (noDataMessage) {
        return true;
      }
    } catch (error) {
    }
    
    const booksCount = await this.getBooksCount();
    return booksCount === 0;
  }

  async refresh() {
    try {
      await this.page.reload({ waitUntil: 'networkidle', timeout: 15000 });
      try {
        await this.page.waitForSelector(this.selectors.booksTable, { timeout: 5000 });
        await this.page.waitForTimeout(2000);
      } catch (error) {
        await this.page.waitForTimeout(2000);
      }
    } catch (error) {
      if (error.message.includes('closed') || error.message.includes('Target')) {
        throw error;
      }
    }
  }

  async forceRefreshData() {
    try {
      await this.page.evaluate(() => {
        const refreshButtons = document.querySelectorAll('[aria-label*="refresh" i], [title*="refresh" i], button:has-text("Refresh")');
        if (refreshButtons.length > 0) {
          refreshButtons[0].click();
        }
      }).catch(() => {
      });
      
      await this.page.waitForTimeout(2000);
    } catch (error) {
    }
  }

  async getUserName() {
    try {
      await this.waitForElementVisible(this.selectors.userNameValue, TIMEOUTS.DEFAULT);
      return await this.getTextTrimmed(this.selectors.userNameValue);
    } catch (error) {
      return '';
    }
  }
}

module.exports = ProfilePage;

