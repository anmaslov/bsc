class Product < ActiveRecord::Base
  validates :title, :description, :image_url, presence: true #поля заполнены
  validates :price, numericality: {greater_than_or_equal_to: 0.01} #поле больше либо равно 0.01
  validates :title, uniqueness: true #поле уникально
  validates :image_url, allow_blank: true, format: { #allow_blank во избежаний получения нескольких сообщений
      with: %r{\.(gif|jpg|png)\Z}i,
      message: 'URL должен указывать на изображение формата GIF, JPG или PNG.'
  }
end
