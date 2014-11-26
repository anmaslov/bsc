module ApplicationHelper
  def hidden_div_if(condition, attributes = {}, &block)
    if condition
      attributes["style"] = "display:none"
    end
    content_tag("div", attributes, &block)
  end

  def title(page_title)
    content_for(:title) { page_title }
  end

  def description(page_title)
    content_for(:description) { page_title }
  end

  def keywords(page_title)
    content_for(:keywords) { page_title }
  end

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def habtm_checkboxes(obj, column, assignment_objects, assignment_object_display_column)
    obj_to_s = obj.class.to_s.split("::").last.underscore
    field_name = "#{obj_to_s}[#{column}][]"
    html = hidden_field_tag(field_name, "")
    assignment_objects.each do |assignment_obj|
      cbx_id = "#{obj_to_s}_#{column}_#{assignment_obj.id}"
      html += check_box_tag field_name, assignment_obj.id, obj.send(column).include?(assignment_obj.id), :id => cbx_id
      html += label_tag cbx_id, h(assignment_obj.send(assignment_object_display_column))
      html += content_tag(:br)
    end
    html
  end

end
