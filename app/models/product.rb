# encoding: utf-8
class Product < ActiveRecord::Base
  has_many :line_items
  has_many :compare_items

  has_many :orders, through: :line_items
  has_many :imgs, :class_name => "ProductImg", dependent: :destroy
  has_many :characters, :class_name => "Character", dependent: :destroy
  has_many :detailing, :class_name => "Detailing", dependent: :destroy
  has_many :documents, :class_name => "Document", dependent: :destroy
  has_many :details, :order => 'position_detail ASC', :class_name => "Detail", :foreign_key => "detail_for_id"
  belongs_to :detail, :class_name => "Detail", :foreign_key => "product_id"

  has_many :reports
  has_many :sliders

  #belongs_to :detail_for, :class_name => "Product", :foreign_key => "detail_for_id"
  #has_many :details, :order => 'title ASC', :class_name => "Product", :foreign_key => "detail_for_id"
  #has_and_belongs_to_many :details, :class_name => "Product", :join_table => "products_details", :association_foreign_key => "detail_id"
  #has_and_belongs_to_many :products, :class_name => "Product", :join_table => "products_details", :foreign_key => "detail_id"
  # has_many :details, :order => 'title ASC', :class_name => "ProductsDetails", :foreign_key => "product_id"


  belongs_to :catalog
  belongs_to :supplier
  belongs_to :brand

  has_attached_file :image, styles: {:medium => "300x300#", :thumb => "150x150>", :thumbnail => "50x50>"}

  before_destroy :ensure_not_referenced_by_any_line_item
  before_destroy :ensure_not_referenced_by_any_compare_item

  validates :title, presence: true #поля заполнены
  validates :price, numericality: {greater_than_or_equal_to: 0.01} #поле больше либо равно 0.01
  validates :article, uniqueness: true #поле уникально

  validates_attachment_content_type :image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  def self.latest
    Product.order(:updated_at).last
  end

  def image_from_url (url)
    dd = URI.parse(url)
    req = Net::HTTP.new(dd.host, dd.port)
    req.read_timeout = 500
    if dd.path != ""
      res = req.request_head(dd.path)
      if res.code == "200"
        self.image = URI.parse(url)
      end
      sleep(1.0/24.0)
    end
  end


  #def imageurl
  #  self.image.url != '' ? self.image.url : 'no-image.png'
  #end

  def market_yandex_boolean
    result = true
    hui = self.market_yandex
    if hui!=1 and hui!=true
      result = false
    end
    result
  end

  def is_active_boolean
    result = true
    hui = self.is_active
    if hui!=1 and hui!=true
      result = false
    end
    result
  end

  def potential_brand
    Brand.all.each do |brand|
      if title != nil and title.downcase.include? brand.title.downcase
        return brand.id
      end
    end
    false
  end

  def isset_value_character_by_name name
    isset_value = Rails.cache.fetch(self.id.to_s + '_isset_value_' + name, expires_in: 24.hours) do
      character_type = CharecterType.where(:name => name).first
      if character_type.present?
        character = Character.where(:product_id => self.id, :charecter_type_id => character_type.id).first
        if character.present?
          true
        else
          false
        end
      else
        false
      end
    end
    isset_value
  end

  def value_character_by_name name
    value = Rails.cache.fetch(self.id.to_s + '_value_' + name, expires_in: 24.hours) do
      character_type = CharecterType.where(:name => name).first
      if character_type.present?
        character = Character.where(:product_id => self.id, :charecter_type_id => character_type.id).first
        if character.present?
          value = character.value
        else
          value = "<span style='color:#ccc'>&mdash;</span>"
        end
      else
        value = "<span style='color:#ccc'>&mdash;</span>"
      end
    end
    value
  end

  def self.re_cache
    CharecterType.all.each do |character|
      product_ids = Character.where(charecter_type_id: character.id).map(&:product_id).uniq#: Character.all.map(&:name).uniq).
      #.where(name: Character.all.map(&:name).uniq).
      Product.where(:is_active => true, :id => product_ids).each do |product|
        product.isset_value_character_by_name character.name
        product.value_character_by_name character.name
      end
    end
  end

  def price_with_margin
    if supplier.present?
      ((price + price * ( supplier.margin / 100 )) * 1.035)
    else
      price
    end
  end

  def art
    obj = article.chomp '-' + supplier_id.to_s
    if obj !~ /^\s*[+-]?((\d+_?)*\d+(\.(\d+_?)*\d+)?|\.(\d+_?)*\d+)(\s*|([eE][+-]?(\d+_?)*\d+)\s*)$/
      obj
    else
      obj.to_i
    end
  end

  private

  # убеждаемся в отсутствии товарных позиций, ссылающихся на данный товар
  def ensure_not_referenced_by_any_line_item
    if line_items.empty?
      true
    else
      errors.add(:base, 'существуют товарные позиции')
      false
    end
  end

  def ensure_not_referenced_by_any_compare_item
    if compare_items.empty?
      true
    else
      errors.add(:base, 'существуют товарные позиции')
      false
    end
  end

end
