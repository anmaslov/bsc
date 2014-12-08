# encoding: utf-8
ActiveAdmin.register Page do

  
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

  permit_params :title, :description, :url, :keywords, :content

  index do
    column :title
    column :description
    column :url
    actions
  end

  form do |f|

    f.inputs "Content" do
      f.input :title, :label => "Заголовок"
      f.input :description, :label => "Описание"
      f.input :content, input_html: {class: "redactor" }
      f.input :keywords, :label => "Ключевые слова"
      f.input :url, :label => "URL"
    end

    f.actions
  end

end
