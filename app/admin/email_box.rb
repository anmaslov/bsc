ActiveAdmin.register EmailBox do

  
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

  permit_params :address, :description, :email

  form :html => { :enctype => "multipart/form-data" } do |f|
    f.inputs 'Почтовый ящик' do
      f.input :address, :label => 'Адрес'
      f.input :description, :label => 'Описание'
      f.input :email, :label => 'Письма'
    end

    f.actions
  end
  
end
