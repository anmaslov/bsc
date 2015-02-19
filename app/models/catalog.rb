# encoding: utf-8
class Catalog < ActiveRecord::Base

  #has_ancestry :orphan_strategy => :rootify

  belongs_to :parent, :class_name => "Catalog", :foreign_key => "parent_id"
  has_many :children, :order => 'title ASC', :class_name => "Catalog", :foreign_key => "parent_id", dependent: :destroy
  has_many :product, :order => 'title ASC', dependent: :destroy
  has_many :old_catalogs, dependent: :destroy
  has_attached_file :image, styles: {:medium => "300x300#", :thumb => "150x150>", :thumbnail => "50x50>"}
  has_many :sliders

  validates :title, :description, presence: true #поля заполнены

  validates_attachment_content_type :image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  #def imageurl
  #  self.image.url != '' ? self.image.url(:thumb) : 'no-image.png'
  #end

  def image_thumb
    if image.exists?
      return image
    end

    product.limit(100).each do |product|

      if product.image.exists?
        return product.image
      end

      if product.imgs.size > 0
        if product.imgs.first.picture.present?
          return product.imgs.first.picture
        end
      end

    end

    children.each do |child|
      if child.image_thumb.present?
        return child.image_thumb
      end
    end
    image
  end

  def count_active_products
    count = product.where(:is_active => true).size

    children.each do |child|
      if child.present?
        count = count + child.count_active_products
      end
    end

    count
  end

  def self.roots
    #catalogs = Catalog.where({:parent_id=>[0, nil]}).order('position ASC')
    Catalog.where({:parent_id=>[0, nil]}).order('title ASC')
  end

  def childrens
    Catalog.where({:parent_id=>self.id}).order('title ASC')
  end

  def is_active_boolean
    result = true
    hui = self.is_active
    if hui!=1 and hui!=true
      result = false
    end
    result
  end

  def characters_names all_products = nil
    if all_products.nil?
      all_products = Product.where(:catalog_id => self.id, :is_active => true)
    end
    characters_names_ = Rails.cache.fetch(self.id.to_s + '_characters_names_for_' + all_products.sum('price').to_s + '_' + all_products.size.to_s, expires_in: 24.hours) do
      characters_names__ = []
      characters__ = []
      all_products.each do |product|
        product.characters.each do |character|
          if character.character_type.present? and ((characters_names__.include? character.character_type.name) == false)
            characters_names__.push(character.character_type.name)
            characters__.push(character)
          end
        end
      end
      Hash['characters_names', characters_names__, 'characters', characters__]
    end
    characters_names_
  end

  def self.re_cache
    Catalog.all.each do |catalos|
      catalos.characters_names
    end
  end

end
