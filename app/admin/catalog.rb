ActiveAdmin.register Catalog, { :sort_order => :title_asc } do
  #sortable tree: true,
  #    max_levels: 0,               # infinite indent levels
  #    protect_root: false,         # allow root items to be dragged
  #    sorting_attribute: :position,
  #    parent_method: :parent,
  #    children_method: :childrens,
  #    roots_method: :roots,
  #    roots_collection: nil,       # proc to specifiy retrieval of roots
  #    collapsible: true,          # show +/- buttons to collapse children
  #    start_collapsed: true

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

  #scope :all, :default => true

  permit_params :image, :title, :description, :parent, :parent_id, :content, :keywords, :is_active, :old_id, :product_table, :catalog_table

  index do
    column :title
    column :description
    actions
  end

  form :html => { :enctype => "multipart/form-data" } do |f|
    f.inputs 'Details' do
      f.input :is_active, :label => 'Активный'
      f.input :parent, :label => 'Родительский каталог'
      f.input :children, :label => 'Дочерние каталоги'
      f.input :title, :label => 'Заголовок'
      f.input :content, input_html: {class: "redactor" }
      f.input :image, as: :file, :label => 'Изображение', :image_preview => true, :hint => f.template.image_tag(f.object.image.url)
      f.input :old_id, :label => 'Старый ID'
    end

    f.inputs 'Продвижение' do
      f.input :description, :as => :text, :label => 'Краткое описание'
      f.input :keywords, :label => 'Ключевые слова'
    end

    f.inputs 'Внешний вид' do
      f.input :catalog_table, :label => 'Каталог в таблице'
      f.input :product_table, :label => 'Товар в таблице'
    end

    f.inputs 'Дополнительные страницы' do
      f.button '+', :action => '#', :type => 'button'
    end

    f.actions
  end




end
