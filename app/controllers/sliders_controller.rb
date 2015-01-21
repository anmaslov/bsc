class SlidersController < ApplicationController

  before_action :set_slider, only: [:show, :edit, :update, :destroy]

  load_and_authorize_resource except: :create
  #skip_authorize_resource :only => [:show, :index]

  def index
    @slider = Slider.all
  end

  def show
    render 'shared/404', :status => 404 if @slider.nil?
  end

  # GET /slider/new
  def new
    @slider = Slider.new
  end

  # GET /slider/1/edit
  def edit
  end

  # POST /slider
  # POST /slider.json
  def create
    @slider = Slider.new(slider_params)

    respond_to do |format|
      if @slider.save
        format.html { redirect_to @slider, notice: 'Slider was successfully created.' }
        format.json { render action: 'show', status: :created, location: @slider }
      else
        format.html { render action: 'new' }
        format.json { render json: @slider.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /slider/1
  # PATCH/PUT /slider/1.json
  def update

    respond_to do |format|
      if @slider.update(slider_params)
        format.html { redirect_to @slider, notice: 'Slider was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @slider.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /slider/1
  # DELETE /slider/1.json
  def destroy
    @slider.destroy
    respond_to do |format|
      format.html { redirect_to sliders_url }
      format.json { head :no_content }
    end
  end

  private
    def set_slider
      @slider = Slider.find(params[:id])
    end

    def slider_params
      params.require(:slider).permit(:title, :link, :image, :product_id, :catalog_id, :news_id)
    end
end

