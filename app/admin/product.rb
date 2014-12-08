ActiveAdmin.register Product do

  
  # See permitted parameters documentation:
  # https://github.com/gregbell/active_admin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # permit_params :list, :of, :attributes, :on, :model
  #
  # or
  #
  # permit_params do
  #  permitted = [:permitted, :attributes]
  #  permitted << :other if resource.something?
  #  permitted
  # end


  permit_params :image, :title, :description, :keywords, :price, :article, :is_active, :market_yandex, :old_price, :catalog

  index do
    column :title
    column :description
    column :price
    column :is_active
    actions
  end

  form :html => { :enctype => "multipart/form-data" } do |f|
    f.inputs 'Описание' do
      f.input :is_active, :label => 'Активный'
      f.input :catalog, :label => 'Родительский каталог'
      f.input :title, :label => 'Заголовок'
      f.input :content, input_html: {class: "redactor" }
      f.input :image, as: :file, :label => 'Изображение', :image_preview => true
      #f.input :imgs, as: :file, :image_preview => true, :hint => f.template.image_tag(f.object.image.url)
    end

    f.inputs 'Торговая информация' do
      f.input :article, :label => 'Артикул'
      f.input :price, :label => 'Цена'
      f.input :old_price, :label => 'Старая цена'
    end

    f.inputs 'Продвижение' do
      f.input :description, :as => :text, :label => 'Краткое описание'
      f.input :keywords, :label => 'Ключевые слова'
      f.input :market_yandex, :label => 'Яндекс.маркет'
    end

    f.actions
  end
  
end
