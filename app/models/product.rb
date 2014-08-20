# encoding: utf-8
class Product < ActiveRecord::Base
  has_many :line_items
  has_many :orders, through: :line_items
  belongs_to :catalog
  belongs_to :supplier

  has_attached_file :image, styles: {:medium => "300x300#", :thumb => "150x150>", :thumbnail => "50x50>"}

  before_destroy :ensure_not_referenced_by_any_line_item

  validates :title, presence: true #поля заполнены
  validates :price, numericality: {greater_than_or_equal_to: 0.01} #поле больше либо равно 0.01
  validates :article, uniqueness: true #поле уникально

  validates_attachment_content_type :image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  def self.latest
    Product.order(:updated_at).last
  end

  #def imageurl
  #  self.image.url != '' ? self.image.url : 'no-image.png'
  #end

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
