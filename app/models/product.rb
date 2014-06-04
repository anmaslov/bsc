class Product < ActiveRecord::Base
  has_many :line_items

  before_destroy :ensure_not_referenced_by_any_line_item

  validates :title, :description, :image_url, presence: true #поля заполнены
  validates :price, numericality: {greater_than_or_equal_to: 0.01} #поле больше либо равно 0.01
  validates :title, uniqueness: true #поле уникально
  validates :image_url, allow_blank: true, format: { #allow_blank во избежаний получения нескольких сообщений
      with: %r{\.(gif|jpg|png)\Z}i,
      message: 'URL должен указывать на изображение формата GIF, JPG или PNG.'
  }

  def self.latest
    Product.order(:updated_at).last
  end

  private

  # убеждаемся в отсутствии товарных позиций, ссылающихся на данный товар
  def ensure_not_referenced_by_any_line_item
    if line_items.empty?
      return true
    else
      errors.add(:base, 'существуют товарные позиции')
      return false
    end
  end
end
