function WeightChart(NumIn){
    this.Color = '#888888';
    
    switch(NumIn){
        case 1:
            this.Color = '#FFFF00';
            break;
        case 2:
            this.Color = '#FF0000';
            break;
        case 3:
            this.Color = '#00FF00';
            break;
        case 4:
            this.Color = '#0000FF';
            break;
        case 5:
            this.Color ='#8844FF'
            break;
        case 6:
            this.Color = '#AAAA00';
            break;
        case 7:
            this.Color = '#AA0000';
            break;
        case 8:
            this.Color = '#00AA00';
            break;
        case 9:
            this.Color = '#0000AA';
            break;
        case 10:
            this.Color = '#4400AA';
            break;
        case 11:
            this.Color = '#888800';
            break;
        case 12:
            this.Color = '#880000';
            break;
        case 13:
            this.Color = '#008800';
            break;
        case 14:
            this.Color = '#000088';
            break;
        case 15:
            this.Color = '#221188';
            break;
        default:
            this.Color = '#888888';
            break;
    }
    return this.Color;
}