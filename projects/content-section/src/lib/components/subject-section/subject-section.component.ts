import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICardClick} from '../model';
import {SubjectSectionService} from '../../services/subject-section.service';
import {forEach} from 'lodash-es';
import * as _ from 'lodash-es';



@Component({
    selector: 'sb-subject-section',
    templateUrl: './subject-section.component.html',
    styleUrls: []
})
export class SubjectSectionComponent implements OnInit {

    @Input() searchRequest: any;
    @Input() title: string;
    @Input() minDisplayCount: number;
    @Input() viewMoreText: string;
    @Input() viewLessText: string;
    @Input() currentPageData: any;
    @Output() clickEvent: EventEmitter<ICardClick> = new EventEmitter<ICardClick>();

    subjectSection = [];

    constructor(
        private subjectSectionService: SubjectSectionService
    ) {
    }

    ngOnInit(): void {
        this.searchRequest.facets = [];
        this.searchRequest.facets.push('subject');
        this.searchBySubject(this.searchRequest);
    }

    handlePillSelect(event) {
        this.clickEvent.emit(event);
    }

    getSectionPillIcon(iconObj, pillValue) {
        return (iconObj && iconObj[pillValue]) || (iconObj && iconObj.default);
    }

    private searchBySubject(searchRequest) {
        this.subjectSectionService.searchBySubject(searchRequest)
            .subscribe((response) => {
                if (_.get(this.currentPageData, 'sections') && _.get(this.currentPageData, 'sections').length > 0) {
                    const facetKeys = _.map(this.currentPageData.sections, (section) => section.facetKey);
                    const facets = this.subjectSectionService.processCourseFacetData(_.get(response, 'result'), facetKeys);
                    forEach(this.currentPageData.sections, facet => {
                        if (_.get(facets, facet.facetKey)) {
                            const _facetArray = [];
                            forEach(facets[facet.facetKey], _facet => {
                                _facetArray.push({
                                    name: _facet.name,
                                    value: _facet.name,
                                    theme: this.subjectSectionService.getRandomColor(facet.theme.colorMapping)
                                });
                            });
                            this.subjectSection.push({
                                name: facet.facetKey,
                                data: _.sortBy(_facetArray, ['name']),
                                section: facet,
                                index: facet.index
                            });
                        }
                    });
                    this.subjectSection = _.sortBy(this.subjectSection, ['index']);
                }

            });
    }

}
