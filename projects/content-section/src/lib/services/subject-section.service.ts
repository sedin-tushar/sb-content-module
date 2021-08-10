import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import * as _ from 'lodash-es';


const HOST = document.location.origin;

@Injectable({
    providedIn: 'root'
})
export class SubjectSectionService {

    constructor(private httpService: HttpClient) {
    }

    searchBySubject(searchRequest) {
        const url = `${HOST}/api/content/v1/search?orgdetails=orgName,email`;
        return this.httpService.post(url, {request: searchRequest})
            .pipe(map((result: any) => {
                return result;
            }));
    }

    processCourseFacetData(sections, keys) {
        const facetObj = {};
        if (sections && sections.facets) {
            _.forEach(sections.facets, (facet) => {
                if (_.indexOf(keys, facet.name) > -1) {
                    if (facetObj[facet.name]) {
                        facetObj[facet.name].push(...facet.values);
                    } else {
                        facetObj[facet.name] = [];
                        facetObj[facet.name].push(...facet.values);
                    }
                }
            });
        }
        return facetObj;
    }

    getRandomColor(colorSet) {
        if (colorSet.length > 0) {
            const randomColor = _.sample(colorSet);
            return {
                iconBgColor: randomColor.primary,
                pillBgColor: randomColor.secondary
            };
        } else {
            return null;
        }
    }
}
